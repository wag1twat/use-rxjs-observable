import { AxiosRequestConfig } from "axios";
import { useEffect, useMemo, useState } from "react";
import {
  asyncScheduler,
  forkJoin,
  from,
  Observable,
  of,
  scheduled,
  Subject,
  zip,
} from "rxjs";
import {
  distinctUntilChanged,
  map,
  merge,
  mergeMap,
  pairwise,
  scan,
  zipAll,
} from "rxjs/operators";
import { RxRequestResult } from "../use-rxjs-requests";
import { SubscribeRequest } from "../use-rxjs-requests/Observables/ObservableRequest";
import { equalArray } from "../use-rxjs-requests/utils/equalArray";
import { equalObjects } from "../use-rxjs-requests/utils/equalObjects";

export type RxRequestConfig = { requetId: string } & AxiosRequestConfig;

class ObservableConfig extends Observable<RxRequestResult> {
  constructor(key: string, config: AxiosRequestConfig) {
    super((observer) => {
      const subscriber = new SubscribeRequest(key, observer, config);

      observer.add(subscriber);

      return () => {
        subscriber.unsubscribe();
      };
    });
  }
}

class UseRequests<T = any> extends Observable<T> {
  private configs$ = new Subject<RxRequestConfig[]>();

  private result$ = new Subject<T>();

  readonly fetch: () => void;

  constructor(configs: RxRequestConfig[]) {
    super((observer) => {
      this.result$
        .pipe(
          distinctUntilChanged((prev, next) => equalObjects(prev, next)),
          scan((acc, current) => {
            return { ...acc, ...current };
          }, {} as T),
          distinctUntilChanged((prev, next) => equalObjects(prev, next))
        )
        .subscribe((v) => {
          observer.next(v);
        });
    });

    this.configs$
      .pipe(
        distinctUntilChanged((prev, next) => equalArray(prev, next)),
        mergeMap((v) => v)
      )
      .subscribe(({ requetId, ...v }) => {
        const subscriber = new ObservableConfig(requetId, v)
          .pipe(distinctUntilChanged((prev, next) => equalObjects(prev, next)))
          .subscribe((result) => {
            this.result$.next(({ [requetId]: result } as unknown) as T);

            if (result.status === "success") {
              subscriber.unsubscribe();
            }
            if (result.status === "error") {
              subscriber.unsubscribe();
            }
          });
      });

    this.fetch = () => {
      this.configs$.next(configs);
    };
  }
}

const useRequests = <T>(configs: RxRequestConfig[] = []) => {
  const [state, setState] = useState<T>({} as T);

  const observable = useMemo(() => new UseRequests<T>(configs), [configs]);

  useEffect(() => {
    const subscription = observable.subscribe(setState);

    return () => {
      subscription.unsubscribe();
    };
  }, [observable]);

  return { state, fetch: () => observable.fetch() };
};

export default useRequests;
