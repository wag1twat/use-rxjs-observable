import { BehaviorSubject, interval, Observable, from, of } from "rxjs";
import { equalObjects } from "../utils/equalObjects";
import RequestSubscriber from "../RequestSubscriber";
import {
  RxRequestResult,
  MultiRxObservableConfigure,
  MultiRxObservableConfig,
  MultiRxObservableStateListener,
  MultiRxObservableState,
  RxRequestConfig,
  MultiObservableConfigurationListener,
  UseRxRequestsFetchFn,
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
} from "rxjs/operators";
import { equalArray } from "../utils/equalArray";
import { ErrorRequest, IdleRequest, SuccessRequest } from "../utils/Results";

export default class MultiObservable<Data, Error> extends Observable<
  RxRequestResult<Data, Error>[]
> {
  private configuration$: BehaviorSubject<
    Partial<
      {
        configs: (RxRequestConfig & { requestId: string })[];
      } & MultiRxObservableConfig<Data, Error>
    >
  > = new BehaviorSubject({});

  private initialState$: BehaviorSubject<
    MultiRxObservableState<Data, Error>
  > = new BehaviorSubject({});

  private state$: BehaviorSubject<
    MultiRxObservableState<Data, Error>
  > = new BehaviorSubject({});

  constructor() {
    super((observer) => {
      observer.add(
        this.configuration$
          .pipe(distinctUntilChanged())
          .subscribe(this.configurationListener(observer))
      );

      observer.add(this.stateListener(observer));

      observer.add(this.initialStateListener());

      this.initialState$.next(this.getInitialState());

      observer.add(this.stateListenerOnResult());
    });

    this.configure = this.configure.bind(this);
    this.configurationListener = this.configurationListener.bind(this);
    this.stateListenerOnResult = this.stateListenerOnResult.bind(this);
    this.getInitialState = this.getInitialState.bind(this);
    this.initialStateListener = this.initialStateListener.bind(this);
    this.stateListener = this.stateListener.bind(this);
    this.fetch = this.fetch.bind(this);
  }

  private getInitialState = () => {
    return LodashReduce(
      this.configuration$.getValue().configs,
      (acc, mutableRequestConfig) => {
        return {
          ...acc,
          [mutableRequestConfig.requestId]: new IdleRequest(
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

  private stateListener: MultiRxObservableStateListener<Data, Error> = (
    observer
  ) => {
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
        const onSuccess = this.configuration$.getValue().onSuccess;

        const onError = this.configuration$.getValue().onError;

        if (onSuccess) {
          if (successes.length) {
            onSuccess(successes as SuccessRequest<Data>[]);
          }
        }
        if (onError) {
          if (errors.length) {
            onError(errors as ErrorRequest<Error>[]);
          }
        }
      });
  };

  private configurationListener: MultiObservableConfigurationListener<
    Data,
    Error
  > = (observer) => (configuration) => {
    this.state$.next(this.getInitialState());

    const { fetchOnMount, refetchInterval } = configuration;

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
  };

  public configure: MultiRxObservableConfigure<Data, Error> = (
    configuration
  ) => {
    const equal = equalObjects(
      {
        ...this.configuration$.getValue(),
        configs: LodashMap(this.configuration$.getValue().configs, (config) =>
          omit(config, "requestId")
        ),
      },
      configuration
    );

    if (!equal) {
      this.configuration$.next({
        ...configuration,
        configs: LodashMap(configuration.configs, (config) => ({
          ...config,
          requestId: v4() + "-xhr-id",
        })),
      });
    }
  };

  public fetch: UseRxRequestsFetchFn = () => {
    const configs = this.configuration$.getValue().configs;

    if (configs)
      from(configs)
        .pipe(
          map((config) => {
            const state = this.state$.getValue()[config.requestId];

            return new Observable<RxRequestResult<Data, Error>>(
              (observer) =>
                new RequestSubscriber<Data, Error>(
                  observer,
                  {
                    ...config,
                    body: { uuid: v4(), body: { uuid: v4() } },
                    params: { uuid: v4(), params: { uuid: v4() } },
                  },
                  state
                )
            );
          }),
          mergeMap((observable) => observable),
          scan<
            RxRequestResult<Data, Error>,
            MultiRxObservableState<Data, Error>
          >((acc, requestResult) => {
            return { ...acc, [requestResult.requestId]: requestResult };
          }, this.state$.getValue()),
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
