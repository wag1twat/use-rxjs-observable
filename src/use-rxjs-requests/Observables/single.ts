import { BehaviorSubject, interval, Observable } from "rxjs";
import RequestSubscriber from "../RequestSubscriber";
import {
  RxRequestResult,
  SingleRxObservableConfigure,
  SingleRxObservableConfig,
  RxMutableRequestConfig,
  UseRxRequestFetchFn,
  OnSuccessUseRxRequest,
  OnErrorUseRxRequest,
  SingleRxObservableConfigListener,
  SingleRxObservableStateListener,
  SingleRxObservableState,
} from "../types";
import { v4 } from "uuid";
import {
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
      observer.add(this.state$.subscribe(this.stateListener(observer)));

      observer.add(this.initialState$.subscribe(this.initialStateListener));

      observer.add(
        this.state$.subscribe((state) => {
          if (this.onSuccess && state.status === "success") {
            this.onSuccess(state as SuccessRequest<Data>);
          }
          if (this.onError && state.status === "error") {
            this.onError(state as ErrorRequest<Error>);
          }
        })
      );

      this.initialState$.next(this.getInitialState());

      observer.add(
        this.singleRxObservableConfig.subscribe(
          this.singleRxObservableConfigListener(observer)
        )
      );
    });

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
  ) => (state) => observer.next(state);

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

  public configure: SingleRxObservableConfigure<Data, Error> = (
    config,
    singleRxObservableConfig,
    onSuccess,
    onError
  ) => {
    this.config.next({ ...config, requestId: v4() });

    this.singleRxObservableConfig.next(singleRxObservableConfig);

    this.onSuccess = onSuccess;

    this.onError = onError;

    const self = this;

    return self;
  };

  public fetch: UseRxRequestFetchFn = (_config?) => {
    const self = this;

    if (_config) {
      return this.config
        .pipe(
          map((config) => {
            const state = self.state$.getValue();
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
          const state = self.state$.getValue();
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
