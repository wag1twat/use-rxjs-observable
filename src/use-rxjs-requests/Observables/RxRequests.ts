import { Observable } from "rxjs";
import { RxRequestsOptions } from "./RxRequestsOptions";
import { RxRequestsConfigure, RxRequestsFetchFn } from "../types";

export default class RxRequests<T> extends Observable<Partial<T>> {
  private options$ = new RxRequestsOptions<T>({});

  constructor() {
    super((observer) => {
      observer.add(
        this.options$.state$.subscribe((state) => {
          observer.next(state);
        })
      );
    });

    this.configure = this.configure.bind(this);
    this.fetch = this.fetch.bind(this);
  }

  public configure: RxRequestsConfigure<T> = (options) => {
    this.options$.next(options);
  };

  public fetch: RxRequestsFetchFn = () => {
    this.options$.fetch();
  };
}
