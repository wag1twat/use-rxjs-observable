import { BehaviorSubject, interval, Observable, Subscriber } from "rxjs";
import RequestSubscriber from "../RequestSubscriber";
import {
  RxRequestResult,
  SingleObservableConfigure,
  RxRequestsSubscriberConfig,
  RxMutableRequestConfig,
  UseRxRequestFetchFn,
} from "../types";
import { v4 } from "uuid";
import {
  distinctUntilKeyChanged,
  map,
  mergeMap,
  startWith,
  takeWhile,
} from "rxjs/operators";
import { IdleRequest } from "../utils/Results";

export default class SingleObservable<Data, Error> extends Observable<
  RxRequestResult<Data, Error>
> {
  // @ts-ignore //TODO: thinking for typing
  private config: BehaviorSubject<RxMutableRequestConfig> = new BehaviorSubject(
    {}
  );

  private subscriberConfig: BehaviorSubject<RxRequestsSubscriberConfig> = new BehaviorSubject(
    {}
  );
  // @ts-ignore //TODO: thinking for typing
  private initialState$: BehaviorSubject<
    RxRequestResult<Data, Error>
  > = new BehaviorSubject({});
  // @ts-ignore //TODO: thinking for typing
  private state$: BehaviorSubject<
    RxRequestResult<Data, Error>
  > = new BehaviorSubject({});

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
    const config = this.config.getValue();
    return new IdleRequest(config.requestId, config);
  };

  private initialStateListener = (initialState: RxRequestResult<Data, Error>) =>
    this.state$.next(initialState);

  private stateListener = (
    observer: Subscriber<RxRequestResult<Data, Error>>
  ) => (state: RxRequestResult<Data, Error>) => observer.next(state);

  private subscriberConfigListener = (
    observer: Subscriber<RxRequestResult<Data, Error>>
  ) => (subscriberConfig: RxRequestsSubscriberConfig) => {
    const { fetchOnMount, refetchInterval } = subscriberConfig;

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

  public configure: SingleObservableConfigure<Data, Error> = (
    config,
    subscriberConfig
  ) => {
    this.config.next({ ...config, requestId: v4() });

    this.subscriberConfig.next(subscriberConfig);

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
