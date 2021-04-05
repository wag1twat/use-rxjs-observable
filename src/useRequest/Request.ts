import { AxiosRequestConfig } from "axios";
import { BehaviorSubject, Observable, Subscriber, Subscription } from "rxjs";
import { switchMap } from "rxjs/operators";
import { equalObjects } from "./equals/objects";
import { RequestSubscriber } from "./RequestSubscriber";
import { Init } from "./result";
import { Config } from "./types";

export class Request<T> extends Subscriber<T> {
  readonly fetch: (axiosConfig?: AxiosRequestConfig) => void;

  private config$ = new BehaviorSubject({} as Config);

  private subscription?: Subscription;

  constructor(config: Config, updater: (result: T) => void) {
    super();

    if (!equalObjects(this.config$.value, config)) {
      this.config$.next(config);

      updater(Init<T>());
    }

    this.fetch = (axiosConfig: AxiosRequestConfig = {}) => {
      this.subscription = this.config$
        .pipe(
          switchMap((v) => {
            return new Observable<T>((observer) => {
              new RequestSubscriber<T>(observer, Object.assign(v, axiosConfig));
            });
          })
        )
        .subscribe((result) => {
          updater(result);
        });
    };
  }

  unsubscribe = () => {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.config$.unsubscribe();

    super.unsubscribe();
  };
}
