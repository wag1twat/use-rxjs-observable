import { Observable } from "rxjs";
import { RxRequestResult, RxRequestConfigure, RxRequestFetchFn } from "../types";
export default class RxRequest<Data, Error> extends Observable<RxRequestResult<Data, Error>> {
    private options$;
    private initialState$;
    private state$;
    constructor();
    private getInitialState;
    private initialStateListener;
    private stateListener;
    private optionsListener;
    configure: RxRequestConfigure<Data, Error>;
    fetch: RxRequestFetchFn;
}
