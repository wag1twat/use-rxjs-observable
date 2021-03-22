import { BehaviorSubject, interval, Observable } from "rxjs";
import { equalObjects } from "../utils/equalObjects";
import RequestSubscriber from "../RequestSubscriber";
import {
  RxRequestResult,
  RxRequestConfigure,
  RxRequestFetchFn,
  RxRequestStateListener,
  RxRequestConfig,
  RxRequestOptionsListener,
  RxUseRequestOptions,
  RxUseRequestState,
} from "../types";
import { v4 } from "uuid";
import {
  distinctUntilChanged,
  map,
  mergeMap,
  startWith,
  takeWhile,
} from "rxjs/operators";
import {
  ErrorRxRequest,
  IdleRxRequest,
  SuccessRxRequest,
} from "../utils/Results";

export default class RxRequest<Data, Error> extends Observable<
  RxRequestResult<Data, Error>
> {
  private options$: BehaviorSubject<
    Partial<RxRequestConfig & RxUseRequestOptions<Data, Error>>
  > = new BehaviorSubject({});

  private requestId$: BehaviorSubject<string> = new BehaviorSubject(v4());

  private initialState$: BehaviorSubject<
    RxUseRequestState<Data, Error>
  > = new BehaviorSubject({} as RxUseRequestState<Data, Error>);

  private state$: BehaviorSubject<
    RxUseRequestState<Data, Error>
  > = new BehaviorSubject({} as RxUseRequestState<Data, Error>);

  constructor() {
    super((observer) => {
      observer.add(this.optionsListener(observer));

      observer.add(this.stateListener(observer));

      observer.add(this.initialStateListener());

      this.initialState$.next(this.getInitialState());
    });

    this.configure = this.configure.bind(this);
    this.optionsListener = this.optionsListener.bind(this);
    this.getInitialState = this.getInitialState.bind(this);
    this.initialStateListener = this.initialStateListener.bind(this);
    this.stateListener = this.stateListener.bind(this);
    this.fetch = this.fetch.bind(this);
  }

  private getInitialState = () => {
    const { method, url, body, params } = this.options$.getValue();
    return new IdleRxRequest(this.requestId$.getValue(), {
      method,
      url,
      body,
      params,
    });
  };

  private initialStateListener = () => {
    return this.initialState$
      .pipe(distinctUntilChanged())
      .subscribe((initialState) => this.state$.next(initialState));
  };

  private stateListener: RxRequestStateListener<Data, Error> = (observer) => {
    const onSuccess = this.options$.getValue().onSuccess;

    const onError = this.options$.getValue().onError;

    return this.state$.pipe(distinctUntilChanged()).subscribe((state) => {
      if (onSuccess) {
        if (state.status === "success") {
          onSuccess(state as SuccessRxRequest<Data>);
        }
      }

      if (onError) {
        if (state.status === "error") {
          onError(state as ErrorRxRequest<Error>);
        }
      }

      observer.next(state);
    });
  };

  private optionsListener: RxRequestOptionsListener<Data, Error> = (
    observer
  ) => {
    return this.options$
      .pipe(distinctUntilChanged())
      .subscribe(({ fetchOnMount, refetchInterval }) => {
        this.state$.next(this.getInitialState());

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

  public configure: RxRequestConfigure<Data, Error> = (options) => {
    const equal = equalObjects(this.options$.getValue(), options);
    if (!equal) {
      this.options$.next(options);
    }
  };

  public fetch: RxRequestFetchFn = (config) => {
    if (config) {
      return this.options$
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
          distinctUntilChanged()
        )
        .forEach((result) => {
          this.state$.next(result);
        });
    }

    return this.options$
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
        distinctUntilChanged()
      )
      .forEach((result) => {
        this.state$.next(result);
      });
  };
}
