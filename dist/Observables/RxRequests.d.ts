import { Observable } from "rxjs";
import { RxRequestsConfigure, RxRequestsFetchFn, RxRequestsState } from "../types";
export default class RxRequests<T> extends Observable<RxRequestsState<T>> {
    private options$;
    constructor();
    configure: RxRequestsConfigure<RxRequestsState<T>>;
    fetch: RxRequestsFetchFn;
}
