import { BehaviorSubject, interval, Observable } from "rxjs";
import { memoize } from "lodash";
import RequestSubscriber from "../RequestSubscriber";
import {
  RxRequestResult,
  SingleRxObservableConfigure,
  SingleRxObservableConfig,
  RxMutableRequestConfig,
  UseRxRequestFetchFn,
  SingleRxObservableConfigListener,
  SingleRxObservableStateListener,
  SingleRxObservableState,
  OnSuccessUseRxRequest,
  OnErrorUseRxRequest,
} from "../types";
import { v4 } from "uuid";
import {
  distinctUntilChanged,
  distinctUntilKeyChanged,
  map,
  mergeMap,
  startWith,
  takeWhile,
} from "rxjs/operators";
import { ErrorRequest, IdleRequest, SuccessRequest } from "../utils/Results";

export default class SingleObservable<Data, Error> extends Observable<
  RxRequestResult<Data, Error>
> {
  private config: BehaviorSubject<RxMutableRequestConfig> = new BehaviorSubject(
    {} as RxMutableRequestConfig
  );

  private singleRxObservableConfig: BehaviorSubject<
    SingleRxObservableConfig<Data, Error>
  > = new BehaviorSubject({});

  private initialState$: BehaviorSubject<
    SingleRxObservableState<Data, Error>
  > = new BehaviorSubject({} as SingleRxObservableState<Data, Error>);
  private state$: BehaviorSubject<
    SingleRxObservableState<Data, Error>
  > = new BehaviorSubject({} as SingleRxObservableState<Data, Error>);

  private onSuccess?: OnSuccessUseRxRequest<Data>;

  private onError?: OnErrorUseRxRequest<Error>;

  constructor() {
    super((observer) => {
      observer.add(
        this.state$
          .pipe(distinctUntilKeyChanged("status"))
          .subscribe(this.stateListener(observer))
      );

      observer.add(
        this.initialState$
          .pipe(distinctUntilKeyChanged("status"))
          .subscribe(this.initialStateListener)
      );

      this.initialState$.next(this.getInitialState());

      observer.add(
        this.singleRxObservableConfig
          .pipe(distinctUntilChanged())
          .subscribe(this.singleRxObservableConfigListener(observer))
      );
    });

    // bindings

    this.configure = this.configure.bind(this);
    this.singleRxObservableConfigListener = this.singleRxObservableConfigListener.bind(
      this
    );
    this.getInitialState = this.getInitialState.bind(this);
    this.initialStateListener = this.initialStateListener.bind(this);
    this.stateListener = this.stateListener.bind(this);
    this.fetch = this.fetch.bind(this);
  }

  private getInitialState = () => {
    const config = this.config.getValue();
    return new IdleRequest(config.requestId, config);
  };

  private initialStateListener = (
    initialState: SingleRxObservableState<Data, Error>
  ) => this.state$.next(initialState);

  private stateListener: SingleRxObservableStateListener<Data, Error> = (
    observer
  ) => (state) => {
    if (this.onSuccess) {
      if (state.status === "success") {
        this.onSuccess(state as SuccessRequest<Data>);
      }
    }

    if (this.onError) {
      if (state.status === "error") {
        this.onError(state as ErrorRequest<Error>);
      }
    }

    observer.next(state);
  };

  private singleRxObservableConfigListener: SingleRxObservableConfigListener<
    Data,
    Error
  > = (observer) => (singleRxObservableConfig) => {
    const { fetchOnMount, refetchInterval } = singleRxObservableConfig;

    if (fetchOnMount && !refetchInterval) {
      this.fetch();
    }

    if (!fetchOnMount && refetchInterval) {
      observer.add(
        interval(refetchInterval)
          .pipe(
            startWith(0),
            takeWhile(() => this.state$.getValue().status !== "loading")
          )
          .subscribe(() => this.fetch())
      );
    }
  };

  public configure: SingleRxObservableConfigure<Data, Error> = ({
    method,
    url,
    body,
    params,
    refetchInterval,
    fetchOnMount,
    fetchOnUpdateConfig,
    onSuccess,
    onError,
  }) => {
    if (method && url) {
      this.config.next({ method, url, body, params, requestId: v4() });
    }

    if (onSuccess) {
      this.onSuccess = memoize(onSuccess);
    }

    if (onError) {
      this.onError = memoize(onError);
    }

    this.singleRxObservableConfig.next({
      refetchInterval,
      fetchOnMount,
      fetchOnUpdateConfig,
    });
  };

  public fetch: UseRxRequestFetchFn = (_config?) => {
    if (_config) {
      return this.config
        .pipe(
          map((config) => {
            const state = this.state$.getValue();
            return new Observable<RxRequestResult<Data, Error>>(
              (observer) =>
                new RequestSubscriber<Data, Error>(
                  observer,
                  { ...config, ..._config },
                  state
                )
            );
          }),
          mergeMap((v) => v),
          distinctUntilKeyChanged("status")
        )
        .forEach((result) => {
          this.state$.next(result);
        });
    }

    return this.config
      .pipe(
        map((config) => {
          const state = this.state$.getValue();
          return new Observable<RxRequestResult<Data, Error>>(
            (observer) =>
              new RequestSubscriber<Data, Error>(observer, config, state)
          );
        }),
        mergeMap((v) => v),
        distinctUntilKeyChanged("status")
      )
      .forEach((result) => {
        this.state$.next(result);
      });
  };
}
