import { Observable } from "rxjs";
import { RxRequestResult, RxRequestsConfigure, RxRequestsFetchFn } from "../types";
export default class RxRequests<Data, Error> extends Observable<RxRequestResult<Data, Error>[]> {
    private options$;
    private initialState$;
    private state$;
    constructor();
    private getInitialState;
    private initialStateListener;
    private stateListener;
    private stateListenerOnResult;
    private optionsListener;
    configure: RxRequestsConfigure<Data, Error>;
    fetch: RxRequestsFetchFn;
}
