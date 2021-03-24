import axios from "axios";
import reduce from "lodash/reduce";
import values from "lodash/values";
import { BehaviorSubject, from, of, Subscription, interval } from "rxjs";
import {
  startWith,
  mergeScan,
  mergeMap,
  distinctUntilChanged,
  takeWhile,
  map,
  filter,
  concatMap,
} from "rxjs/operators";
import { equalObjects } from "../utils/equalObjects";
import { Error, Idle, Loading, Success } from "../utils/Results";
import {
  RxRequestConfig,
  RxRequestsState,
  RxUseRequestsOptions,
} from "../types";

export class RxRequestsOptions<T = any> extends BehaviorSubject<
  Partial<
    { configs: RxRequestConfig[] } & RxUseRequestsOptions<RxRequestsState<T>>
  >
> {
  readonly state$ = new BehaviorSubject<RxRequestsState<T>>(
    {} as RxRequestsState<T>
  );

  private interval$?: Subscription;

  private onResults$: Subscription;

  constructor(
    value: Partial<
      { configs: RxRequestConfig[] } & RxUseRequestsOptions<RxRequestsState<T>>
    >
  ) {
    super(value);

    this.subscribe((options) => {
      if (options.configs) {
        this.state$.next(
          reduce<RxRequestConfig, RxRequestsState<T>>(
            options.configs,
            (acc, current) => ({
              ...acc,
              [current.requestId]: new Idle(current.requestId),
            }),
            {}
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
              takeWhile(() =>
                values(this.state$.getValue()).every(
                  (item) => item?.status && item.status !== "loading"
                )
              )
            )
            .subscribe(() => this.fetch());
        }
      }
    });

    this.onResults$ = this.state$
      .pipe(
        map((state) => values(state)),
        filter((state) =>
          state.every((item) => item?.status && item.status !== "idle")
        ),
        filter((state) =>
          state.every((item) => item?.status && item.status !== "loading")
        ),
        concatMap((state) => {
          return of({
            successes: reduce(
              state.filter((item) => item?.status && item.status === "success"),
              (acc, current) => {
                if (current) {
                  return {
                    ...acc,
                    [String(current?.requestId)]: current,
                  };
                }
                return acc;
              },
              {} as RxRequestsState<T>
            ),
            errors: reduce(
              state.filter((item) => item?.status && item.status === "error"),
              (acc, current) => {
                if (current) {
                  return {
                    ...acc,
                    [String(current?.requestId)]: current,
                  };
                }
                return acc;
              },
              {} as RxRequestsState<T>
            ),
          });
        }),
        distinctUntilChanged((prev, next) => equalObjects(prev, next))
      )
      .subscribe((state) => {
        const onSuccess = this.getValue().onSuccess;
        const onError = this.getValue().onError;

        if (onSuccess) {
          onSuccess(state.successes);
        }

        if (onError) {
          onError(state.errors);
        }
      });

    this.next = this.next.bind(this);
    this.fetch = this.fetch.bind(this);
  }

  readonly fetch = () => {
    const { configs } = this.getValue();

    if (configs) {
      from(configs)
        .pipe(
          mergeMap((v) => of(v)),
          distinctUntilChanged((prev, next) => equalObjects(prev, next)),
          mergeMap((axiosConfig) => {
            return from(
              axios
                .request(axiosConfig)
                .then((response) => {
                  return new Success<typeof response>(
                    axiosConfig.requestId,
                    response
                  );
                })
                .catch(
                  (error) =>
                    new Error<typeof error>(axiosConfig.requestId, error)
                )
            ).pipe(
              startWith(new Loading(axiosConfig.requestId)),
              distinctUntilChanged((prev, next) => equalObjects(prev, next))
            );
          }),
          mergeScan((acc, current) => {
            if (current.status === "loading") {
              const response = this.state$.value[current.requestId]?.response
                ? this.state$.value[current.requestId]?.response
                : null;
              const error = this.state$.value[current.requestId]?.error
                ? this.state$.value[current.requestId]?.error
                : null;

              return of({
                ...acc,
                [current.requestId]: {
                  ...current,
                  response,
                  error,
                },
              }).pipe(
                distinctUntilChanged((prev, next) => equalObjects(prev, next))
              );
            }
            return of({
              ...acc,
              [current.requestId]: current,
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
    value: Partial<
      { configs: RxRequestConfig[] } & RxUseRequestsOptions<RxRequestsState<T>>
    >
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
