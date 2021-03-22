import { BehaviorSubject, interval, Observable } from "rxjs";
import { equalObjects } from "../utils/equalObjects";
import RequestSubscriber from "../RequestSubscriber";
import {
  RxRequestResult,
  SingleRxObservableConfigure,
  SingleRxObservableConfig,
  UseRxRequestFetchFn,
  SingleRxObservableStateListener,
  SingleRxObservableState,
  RxRequestConfig,
  SingleObservableConfigurationListener,
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
  private configuration$: BehaviorSubject<
    Partial<RxRequestConfig & SingleRxObservableConfig<Data, Error>>
  > = new BehaviorSubject({});

  private requestId$: BehaviorSubject<string> = new BehaviorSubject(v4());

  private initialState$: BehaviorSubject<
    SingleRxObservableState<Data, Error>
  > = new BehaviorSubject({} as SingleRxObservableState<Data, Error>);

  private state$: BehaviorSubject<
    SingleRxObservableState<Data, Error>
  > = new BehaviorSubject({} as SingleRxObservableState<Data, Error>);

  constructor() {
    super((observer) => {
      observer.add(this.configurationListener(observer));

      observer.add(this.stateListener(observer));

      observer.add(this.initialStateListener());

      this.initialState$.next(this.getInitialState());
    });

    this.configure = this.configure.bind(this);
    this.configurationListener = this.configurationListener.bind(this);
    this.getInitialState = this.getInitialState.bind(this);
    this.initialStateListener = this.initialStateListener.bind(this);
    this.stateListener = this.stateListener.bind(this);
    this.fetch = this.fetch.bind(this);
  }

  private getInitialState = () => {
    const { method, url, body, params } = this.configuration$.getValue();
    return new IdleRequest(this.requestId$.getValue(), {
      method,
      url,
      body,
      params,
    });
  };

  private initialStateListener = () => {
    return this.initialState$
      .pipe(distinctUntilKeyChanged("status"))
      .subscribe((initialState) => this.state$.next(initialState));
  };

  private stateListener: SingleRxObservableStateListener<Data, Error> = (
    observer
  ) => {
    const onSuccess = this.configuration$.getValue().onSuccess;

    const onError = this.configuration$.getValue().onError;

    return this.state$
      .pipe(distinctUntilKeyChanged("status"))
      .subscribe((state) => {
        if (onSuccess) {
          if (state.status === "success") {
            onSuccess(state as SuccessRequest<Data>);
          }
        }

        if (onError) {
          if (state.status === "error") {
            onError(state as ErrorRequest<Error>);
          }
        }

        observer.next(state);
      });
  };

  private configurationListener: SingleObservableConfigurationListener<
    Data,
    Error
  > = (observer) => {
    return this.configuration$
      .pipe(distinctUntilChanged())
      .subscribe(({ fetchOnMount, refetchInterval }) => {
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
      });
  };

  public configure: SingleRxObservableConfigure<Data, Error> = (
    configuration
  ) => {
    const equal = equalObjects(this.configuration$.getValue(), configuration);
    if (!equal) {
      this.configuration$.next(configuration);
    }
  };

  public fetch: UseRxRequestFetchFn = (config) => {
    if (config) {
      return this.configuration$
        .pipe(
          map(({ method, url, body, params }) => {
            const state = this.state$.getValue();

            return new Observable<RxRequestResult<Data, Error>>(
              (observer) =>
                new RequestSubscriber<Data, Error>(
                  observer,
                  {
                    method,
                    url,
                    body,
                    params,
                    requestId: this.requestId$.getValue(),
                    ...config,
                  },
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

    return this.configuration$
      .pipe(
        map(({ method, url, body, params }) => {
          const state = this.state$.getValue();
          return new Observable<RxRequestResult<Data, Error>>(
            (observer) =>
              new RequestSubscriber<Data, Error>(
                observer,
                {
                  method,
                  url,
                  body,
                  params,
                  requestId: this.requestId$.getValue(),
                },
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
  };
}
