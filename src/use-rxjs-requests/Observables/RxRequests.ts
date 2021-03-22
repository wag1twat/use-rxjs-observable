import { BehaviorSubject, interval, Observable, from, of } from "rxjs";
import { equalObjects } from "../utils/equalObjects";
import RequestSubscriber from "../RequestSubscriber";
import {
  RxRequestResult,
  RxRequestsConfigure,
  RxRequestsFetchFn,
  RxRequestsStateListener,
  RxRequestConfig,
  RxRequestsOptionsListener,
  RxUseRequestsOptions,
  RxUseRequestsState,
} from "../types";
import {
  map as LodashMap,
  reduce as LodashReduce,
  values as LodashValues,
  omit,
} from "lodash";
import { v4 } from "uuid";
import {
  filter,
  map,
  mergeMap,
  pairwise,
  scan,
  startWith,
  takeWhile,
  distinctUntilChanged,
  concatMap,
  tap,
} from "rxjs/operators";
import { equalArray } from "../utils/equalArray";
import {
  ErrorRxRequest,
  IdleRxRequest,
  SuccessRxRequest,
} from "../utils/Results";

export default class RxRequests<Data, Error> extends Observable<
  RxRequestResult<Data, Error>[]
> {
  private options$: BehaviorSubject<
    Partial<
      {
        configs: (RxRequestConfig & { requestId: string })[];
      } & RxUseRequestsOptions<Data, Error>
    >
  > = new BehaviorSubject({});

  private initialState$: BehaviorSubject<
    RxUseRequestsState<Data, Error>
  > = new BehaviorSubject({});

  private state$: BehaviorSubject<
    RxUseRequestsState<Data, Error>
  > = new BehaviorSubject({});

  constructor() {
    super((observer) => {
      observer.add(this.optionsListener(observer));

      observer.add(this.stateListener(observer));

      observer.add(this.initialStateListener());

      this.initialState$.next(this.getInitialState());

      observer.add(this.stateListenerOnResult());
    });

    this.configure = this.configure.bind(this);
    this.optionsListener = this.optionsListener.bind(this);
    this.stateListenerOnResult = this.stateListenerOnResult.bind(this);
    this.getInitialState = this.getInitialState.bind(this);
    this.initialStateListener = this.initialStateListener.bind(this);
    this.stateListener = this.stateListener.bind(this);
    this.fetch = this.fetch.bind(this);
  }

  private getInitialState = () => {
    return LodashReduce(
      this.options$.getValue().configs,
      (acc, mutableRequestConfig) => {
        return {
          ...acc,
          [mutableRequestConfig.requestId]: new IdleRxRequest(
            mutableRequestConfig.requestId,
            mutableRequestConfig
          ),
        };
      },
      {}
    );
  };

  private initialStateListener = () => {
    return this.initialState$
      .pipe(distinctUntilChanged())
      .subscribe((initialState) => {
        this.state$.next(initialState);
      });
  };

  private stateListener: RxRequestsStateListener<Data, Error> = (observer) => {
    return this.state$.pipe(distinctUntilChanged()).subscribe((state) => {
      observer.next(LodashValues(state));
    });
  };

  private stateListenerOnResult = () => {
    return this.state$
      .pipe(
        map((state) => LodashValues(state)),
        filter((state) => state.every(({ status }) => status !== "idle")),
        filter((state) => state.every(({ status }) => status !== "loading")),
        concatMap((state) => {
          const successes = state.filter(({ status }) => status === "success");

          const errors = state.filter(({ status }) => status === "error");

          return of({ successes, errors });
        }),
        distinctUntilChanged()
      )
      .subscribe(({ successes, errors }) => {
        const onSuccess = this.options$.getValue().onSuccess;

        const onError = this.options$.getValue().onError;

        if (onSuccess) {
          if (successes.length) {
            onSuccess(successes as SuccessRxRequest<Data>[]);
          }
        }
        if (onError) {
          if (errors.length) {
            onError(errors as ErrorRxRequest<Error>[]);
          }
        }
      });
  };

  private optionsListener: RxRequestsOptionsListener<Data, Error> = (
    observer
  ) => {
    return this.options$.pipe(distinctUntilChanged()).subscribe((options) => {
      this.state$.next(this.getInitialState());

      const { fetchOnMount, refetchInterval } = options;

      if (fetchOnMount && !refetchInterval) {
        this.fetch();
      }

      if (!fetchOnMount && refetchInterval) {
        observer.add(
          interval(refetchInterval)
            .pipe(
              startWith(0),
              takeWhile(() =>
                LodashValues(this.state$.getValue()).every(
                  (result) => result.status !== "loading"
                )
              )
            )
            .subscribe(() => this.fetch())
        );
      }
    });
  };

  public configure: RxRequestsConfigure<Data, Error> = (options) => {
    const equal = equalObjects(
      {
        ...this.options$.getValue(),
        configs: LodashMap(this.options$.getValue().configs, (config) =>
          omit(config, "requestId")
        ),
      },
      options
    );

    if (!equal) {
      this.options$.next({
        ...options,
        configs: LodashMap(options.configs, (config) => ({
          ...config,
          requestId: v4() + "-xhr-id",
        })),
      });
    }
  };

  public fetch: RxRequestsFetchFn = () => {
    const configs = this.options$.getValue().configs;

    if (configs)
      from(configs)
        .pipe(
          map((config) => {
            const state = this.state$.getValue()[config.requestId];

            return new Observable<RxRequestResult<Data, Error>>(
              (observer) =>
                new RequestSubscriber<Data, Error>(observer, config, state)
            );
          }),
          mergeMap((observable) => observable),
          scan<RxRequestResult<Data, Error>, RxUseRequestsState<Data, Error>>(
            (acc, requestResult) => {
              return { ...acc, [requestResult.requestId]: requestResult };
            },
            this.state$.getValue()
          ),
          map((v) => LodashValues(v)),
          pairwise(),
          filter(([prev, next]) => !equalArray(prev, next)),
          map(([_, next]) => next),
          map((result) => {
            return LodashReduce(
              result,
              (acc, current) => {
                return { ...acc, [current.requestId]: current };
              },
              {}
            );
          })
        )
        .forEach((result) => this.state$.next(result));
  };
}
