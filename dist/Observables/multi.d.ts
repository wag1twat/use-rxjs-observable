import { Observable } from "rxjs";
import { RxRequestResult, MultiRxObservableConfigure } from "../types";
export default class MultiObservable<Data, Error> extends Observable<RxRequestResult<Data, Error>[]> {
    private configs;
    private multiRxObservableConfig;
    private initialState$;
    private state$;
    constructor();
    private getInitialState;
    private initialStateListener;
    private stateListener;
    private multiRxObservableConfigListener;
    configure: MultiRxObservableConfigure<Data, Error>;
    fetch: () => void;
}
