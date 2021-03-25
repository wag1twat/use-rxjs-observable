import axios, { AxiosRequestConfig } from "axios";
import { BehaviorSubject, from, of, Subscription, interval, pairs } from "rxjs";
import {
  startWith,
  mergeScan,
  mergeMap,
  distinctUntilChanged,
  takeWhile,
  map,
  filter,
} from "rxjs/operators";
import { equalObjects } from "../utils/equalObjects";
import {
  Error,
  Idle,
  Loading,
  RxRequestResult,
  Success,
} from "../utils/Results";
import { RxRequestConfig, RxUseRequestsOptions } from "../types";
import { reduce } from "lodash";

export class RxRequestsOptions<T = any> extends BehaviorSubject<
  Partial<{ configs: RxRequestConfig<T> } & RxUseRequestsOptions<T>>
> {
  readonly state$ = new BehaviorSubject<Partial<T>>({} as Partial<T>);

  private interval$?: Subscription;

  private onResults$: Subscription;

  constructor(
    value: Partial<{ configs: RxRequestConfig<T> } & RxUseRequestsOptions<T>>
  ) {
    super(value);

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
        filter((v) =>
          v.every(
            ([_, state]) =>
              state.status !== "idle" && state.status !== "loading"
          )
        ),
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
          distinctUntilChanged((prev, next) => equalObjects(prev, next)),
          mergeMap(([key, axiosConfig]) => {
            const state = (this.state$.getValue() as unknown) as {
              [key: string]: RxRequestResult;
            };
            return from(
              axios
                .request(axiosConfig)
                .then((response) => {
                  return { [key]: new Success<typeof response>(response) };
                })
                .catch((error) => {
                  return { [key]: new Error<typeof error>(error) };
                })
            ).pipe(
              startWith({
                [key]: {
                  ...new Loading(),
                  response: state[key].response,
                  error: state[key].error,
                },
              }),
              distinctUntilChanged((prev, next) => equalObjects(prev, next))
            );
          }),
          mergeScan((acc, current) => {
            return of({
              ...acc,
              ...current,
            }).pipe(
              distinctUntilChanged((prev, next) => equalObjects(prev, next))
            );
          }, this.state$.getValue()),
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
