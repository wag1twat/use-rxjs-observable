import { AxiosRequestConfig } from "axios";
import { BehaviorSubject, of, Subscription, interval, pairs } from "rxjs";
import {
  startWith,
  mergeMap,
  distinctUntilChanged,
  takeWhile,
  map,
  filter,
  scan,
} from "rxjs/operators";
import { equalObjects } from "../utils/equalObjects";
import { Idle, RxRequestResult } from "../utils/Results";
import {
  RxRequestConfig,
  RxRequestsConfigureArgument,
  RxUseRequestsOptions,
} from "../types";
import { reduce } from "lodash";
import { equalArray } from "../utils/equalArray";
import { ObservableRequest } from "./ObservableRequest";

export class RxRequestsOptions<T = any> extends BehaviorSubject<
  RxRequestsConfigureArgument<T>
> {
  readonly state$ = new BehaviorSubject<Partial<T>>({});

  private interval$?: Subscription;

  private onResults$: Subscription;

  constructor(options: RxRequestsConfigureArgument<T>) {
    super(options);

    this.subscribe((options) => {
      if (options.configs) {
        this.state$.next(
          reduce(
            Object.keys(options.configs),
            (acc, current) => {
              return { ...acc, [current]: new Idle() };
            },
            {} as T
          )
        );

        const { fetchOnMount, refetchInterval } = this.getValue();

        if (fetchOnMount && !refetchInterval) {
          this.fetch();
        }

        if (!fetchOnMount && refetchInterval) {
          this.interval$ = interval(refetchInterval)
            .pipe(
              startWith(0),
              takeWhile(() => {
                const entries = Object.values(this.state$.getValue()) as Array<
                  T[keyof T] extends RxRequestResult ? RxRequestResult : any
                >;
                return entries.every(
                  (item) => item?.status && item.status !== "loading"
                );
              })
            )
            .subscribe(() => this.fetch());
        }
      }
    });

    this.onResults$ = this.state$
      .pipe(
        map(
          (v) =>
            Object.entries(v) as Array<
              [
                keyof T,
                T[keyof T] extends RxRequestResult ? RxRequestResult : any
              ]
            >
        ),
        filter((v) => {
          return v.every(([_, state]) => state.status !== "idle");
        }),
        filter((v) => {
          return v.every(([_, state]) => state.status !== "loading");
        }),
        map((v) => {
          const successes = v
            .filter(([_, state]) => state.status === "success")
            .reduce<T>((acc, [key, state]) => {
              return { ...acc, [key]: state };
            }, {} as T);

          const errors = v
            .filter(([_, state]) => state.status === "error")
            .reduce<T>((acc, [key, state]) => {
              return { ...acc, [key]: state };
            }, {} as T);

          return { successes, errors };
        }),
        distinctUntilChanged((prev, next) => equalObjects(prev, next))
      )
      .subscribe(({ successes, errors }) => {
        const onSuccess = this.getValue().onSuccess;

        const onError = this.getValue().onError;

        if (onSuccess) {
          onSuccess(successes);
        }

        if (onError) {
          onError(errors);
        }
      });

    this.next = this.next.bind(this);
    this.fetch = this.fetch.bind(this);
  }

  readonly fetch = () => {
    const { configs } = this.getValue();

    if (configs) {
      of(configs)
        .pipe(
          mergeMap((v) => pairs<AxiosRequestConfig>(v)),
          distinctUntilChanged((prev, next) => equalArray(prev, next)),
          mergeMap(([key, axiosConfig]) => {
            return new ObservableRequest(key, axiosConfig).pipe(
              distinctUntilChanged((prev, next) => equalObjects(prev, next))
            );
          }),
          scan(
            (acc, current) => ({ ...acc, ...current }),
            this.state$.getValue()
          ),
          distinctUntilChanged((prev, next) => equalObjects(prev, next))
        )
        .forEach((result) => {
          this.state$.next(result);
        });
    }
  };

  readonly next = (
    value: Partial<{ configs: RxRequestConfig<T> } & RxUseRequestsOptions<T>>
  ) => {
    const equal = equalObjects(this.getValue(), value);

    if (!equal) {
      super.next(value);
    }
  };

  readonly unsubscribe = () => {
    super.unsubscribe();
    this.state$.unsubscribe();
    this.onResults$.unsubscribe();

    if (this.interval$) {
      this.interval$.unsubscribe();
    }
  };
}
