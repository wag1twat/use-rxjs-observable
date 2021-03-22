import { Observable } from "rxjs";
import { RxRequestResult, SingleRxObservableConfigure, UseRxRequestFetchFn } from "../types";
export default class SingleObservable<Data, Error> extends Observable<RxRequestResult<Data, Error>> {
    private configuration$;
    private requestId$;
    private initialState$;
    private state$;
    constructor();
    private getInitialState;
    private initialStateListener;
    private stateListener;
    private configurationListener;
    configure: SingleRxObservableConfigure<Data, Error>;
    fetch: UseRxRequestFetchFn;
}
