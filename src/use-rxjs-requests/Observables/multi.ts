import { BehaviorSubject, interval, Observable, Subscriber } from "rxjs";
import RequestSubscriber from "../RequestSubscriber";
import {
  RxRequestResult,
  MultiObservableConfigure,
  RxRequestsSubscriberConfig,
  RxMutableRequestConfig,
} from "../types";
import {
  map as LodashMap,
  reduce as LodashReduce,
  values as LodashValues,
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
} from "rxjs/operators";
import { arraysOfObjectsEqual } from "../utils/equals";
import { IdleRequest } from "../utils/Results";

export default class MultiObservable<Data, Error> extends Observable<
  RxRequestResult<Data, Error>[]
> {
  private configs: BehaviorSubject<
    RxMutableRequestConfig[]
  > = new BehaviorSubject([]);

  private subscriberConfig: BehaviorSubject<RxRequestsSubscriberConfig> = new BehaviorSubject(
    { fetchOnMount: false, refetchInterval: undefined }
  );

  private initialState$: BehaviorSubject<{
    [key: string]: RxRequestResult<Data, Error>;
  }> = new BehaviorSubject({});

  private state$: BehaviorSubject<{
    [key: string]: RxRequestResult<Data, Error>;
  }> = new BehaviorSubject({});

  constructor() {
    super((observer) => {
      observer.add(this.state$.subscribe(this.stateListener(observer)));

      observer.add(this.initialState$.subscribe(this.initialStateListener));

      this.initialState$.next(this.getInitialState());

      observer.add(
        this.subscriberConfig.subscribe(this.subscriberConfigListener(observer))
      );
    });

    this.configure = this.configure.bind(this);
    this.subscriberConfigListener = this.subscriberConfigListener.bind(this);
    this.getInitialState = this.getInitialState.bind(this);
    this.initialStateListener = this.initialStateListener.bind(this);
    this.stateListener = this.stateListener.bind(this);
    this.fetch = this.fetch.bind(this);
  }

  private getInitialState = () => {
    return LodashReduce(
      this.configs.getValue(),
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

  private initialStateListener = (initialState: {
    [key: string]: RxRequestResult<Data, Error>;
  }) => this.state$.next(initialState);

  private stateListener = (
    observer: Subscriber<RxRequestResult<Data, Error>[]>
  ) => (state: { [key: string]: RxRequestResult<Data, Error> }) =>
    observer.next(LodashValues(state));

  private subscriberConfigListener = (
    observer: Subscriber<RxRequestResult<Data, Error>[]>
  ) => ({ fetchOnMount, refetchInterval }: RxRequestsSubscriberConfig) => {
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

  public configure: MultiObservableConfigure<Data, Error> = (
    configs,
    subscriberConfig
  ) => {
    this.configs.next(
      LodashMap(configs, (config) => ({
        ...config,
        requestId: v4() + "-xhr-id",
      }))
    );

    this.subscriberConfig.next(subscriberConfig);

    const self = this;

    return self;
  };

  public fetch = () => {
    this.configs
      .pipe(
        mergeMap((configs) => configs),
        map((config) => {
          const state = this.state$.getValue()[config.requestId];
          return new Observable<RxRequestResult<Data, Error>>(
            (observer) =>
              new RequestSubscriber<Data, Error>(observer, config, state)
          );
        }),
        mergeMap((observable) => observable),
        scan<
          RxRequestResult<Data, Error>,
          {
            [key: string]: RxRequestResult<Data, Error>;
          }
        >((acc, requestResult) => {
          return { ...acc, [requestResult.requestId]: requestResult };
        }, this.state$.getValue()),
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
