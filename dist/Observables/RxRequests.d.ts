import { Observable } from "rxjs";
import { RxRequestsConfigure, RxRequestsFetchFn } from "../types";
export default class RxRequests<T> extends Observable<Partial<T>> {
    private options$;
    constructor();
    configure: RxRequestsConfigure<T>;
    fetch: RxRequestsFetchFn;
}
