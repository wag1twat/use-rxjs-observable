import { Observable } from "rxjs";
import { RxRequestResult, MultiRxObservableConfigure, UseRxRequestsFetchFn } from "../types";
export default class MultiObservable<Data, Error> extends Observable<RxRequestResult<Data, Error>[]> {
    private configuration$;
    private initialState$;
    private state$;
    constructor();
    private getInitialState;
    private initialStateListener;
    private stateListener;
    private stateListenerOnResult;
    private configurationListener;
    configure: MultiRxObservableConfigure<Data, Error>;
    fetch: UseRxRequestsFetchFn;
}
