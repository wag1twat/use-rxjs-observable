import { Observable } from "rxjs";
import { RxRequestResult, SingleObservableConfigure } from "../types";
export default class SingleObservable<Data, Error> extends Observable<RxRequestResult<Data, Error>> {
    private config;
    private subscriberConfig;
    private initialState$;
    private state$;
    constructor();
    private getInitialState;
    private initialStateListener;
    private stateListener;
    private subscriberConfigListener;
    configure: SingleObservableConfigure<Data, Error>;
    fetch: () => void;
}
