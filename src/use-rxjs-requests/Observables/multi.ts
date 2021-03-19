import { BehaviorSubject, interval, Observable, from, of } from "rxjs";
import RequestSubscriber from "../RequestSubscriber";
import {
  RxRequestResult,
  MultiRxObservableConfigure,
  MultiRxObservableConfig,
  RxMutableRequestConfig,
  MultiRxObservableConfigListener,
  MultiRxObservableStateListener,
  MultiRxObservableState,
  OnSuccessUseRxRequests,
  OnErrorUseRxRequests,
} from "../types";
import {
  map as LodashMap,
  reduce as LodashReduce,
  values as LodashValues,
  memoize,
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
import { arraysOfObjectsEqual } from "../utils/equals";
import { ErrorRequest, IdleRequest, SuccessRequest } from "../utils/Results";

export default class MultiObservable<Data, Error> extends Observable<
  RxRequestResult<Data, Error>[]
> {
  private configs: RxMutableRequestConfig[] = [];

  private multiRxObservableConfig: BehaviorSubject<
    MultiRxObservableConfig<Data, Error>
  > = new BehaviorSubject({});

  private initialState$: BehaviorSubject<
    MultiRxObservableState<Data, Error>
  > = new BehaviorSubject({});

  private state$: BehaviorSubject<
    MultiRxObservableState<Data, Error>
  > = new BehaviorSubject({});

  private onSuccess?: OnSuccessUseRxRequests<Data>;

  private onError?: OnErrorUseRxRequests<Error>;

  constructor() {
    super((observer) => {
      observer.add(this.state$.subscribe(this.stateListener(observer)));

      observer.add(this.initialState$.subscribe(this.initialStateListener));

      this.initialState$.next(this.getInitialState());

      observer.add(
        this.state$
          .pipe(
            map((state) => LodashValues(state)),
            filter((state) => state.every(({ status }) => status !== "idle")),
            filter((state) =>
              state.every(({ status }) => status !== "loading")
            ),
            concatMap((state) => {
              const successes = state.filter(
                ({ status }) => status === "success"
              );

              const errors = state.filter(({ status }) => status === "error");

              return of({ successes, errors });
            }),
            distinctUntilChanged()
          )
          .subscribe(({ successes, errors }) => {
            if (this.onSuccess) {
              if (successes.length) {
                this.onSuccess(successes as SuccessRequest<Data>[]);
              }
            }
            if (this.onError) {
              if (errors.length) {
                this.onError(errors as ErrorRequest<Error>[]);
              }
            }
          })
      );

      observer.add(
        this.multiRxObservableConfig.subscribe(
          this.multiRxObservableConfigListener(observer)
        )
      );

      observer.add(
        from(this.configs)
          .pipe(
            takeWhile(() =>
              Boolean(
                this.multiRxObservableConfig.getValue().fetchOnUpdateConfigs
              )
            )
          )
          .subscribe(() => this.fetch())
      );
    });

    this.configure = this.configure.bind(this);
    this.multiRxObservableConfigListener = this.multiRxObservableConfigListener.bind(
      this
    );
    this.getInitialState = this.getInitialState.bind(this);
    this.initialStateListener = this.initialStateListener.bind(this);
    this.stateListener = this.stateListener.bind(this);
    this.fetch = this.fetch.bind(this);
  }

  private getInitialState = () => {
    return LodashReduce(
      this.configs,
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

  private initialStateListener = (
    initialState: MultiRxObservableState<Data, Error>
  ) => this.state$.next(initialState);

  private stateListener: MultiRxObservableStateListener<Data, Error> = (
    observer
  ) => (state) => observer.next(LodashValues(state));

  private multiRxObservableConfigListener: MultiRxObservableConfigListener<
    Data,
    Error
  > = (observer) => (multiRxObservableConfig) => {
    const { fetchOnMount, refetchInterval } = multiRxObservableConfig;

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

  public configure: MultiRxObservableConfigure<Data, Error> = ({
    configs,
    refetchInterval,
    fetchOnUpdateConfigs,
    fetchOnMount,
    onSuccess,
    onError,
  }) => {
    if (configs) {
      this.configs = LodashMap(configs, (config) => ({
        ...config,
        requestId: v4() + "-xhr-id",
      }));
    }

    if (onSuccess) {
      this.onSuccess = memoize(onSuccess);
    }

    if (onError) {
      this.onError = memoize(onError);
    }

    this.multiRxObservableConfig.next({
      refetchInterval,
      fetchOnMount,
      fetchOnUpdateConfigs,
    });
  };

  public fetch = () => {
    from(this.configs)
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
        scan<RxRequestResult<Data, Error>, MultiRxObservableState<Data, Error>>(
          (acc, requestResult) => {
            return { ...acc, [requestResult.requestId]: requestResult };
          },
          this.state$.getValue()
        ),
        map((v) => LodashValues(v)),
        pairwise(),
        filter(([prev, next]) => !arraysOfObjectsEqual(prev, next)),
        map(([_, next]) => next),
        map((result) =>
          LodashReduce(
            result,
            (acc, current) => {
              return { ...acc, [current.requestId]: current };
            },
            {}
          )
        )
      )
      .forEach((result) => this.state$.next(result));
  };
}
