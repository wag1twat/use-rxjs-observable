import { Observable } from "rxjs";
import { RxRequestResult, SingleRxObservableConfigure, UseRxRequestFetchFn } from "../types";
export default class SingleObservable<Data, Error> extends Observable<RxRequestResult<Data, Error>> {
    private config;
    private singleRxObservableConfig;
    private initialState$;
    private state$;
    private onSuccess?;
    private onError?;
    constructor();
    private getInitialState;
    private initialStateListener;
    private stateListener;
    private singleRxObservableConfigListener;
    configure: SingleRxObservableConfigure<Data, Error>;
    fetch: UseRxRequestFetchFn;
}
