import { Observable } from "rxjs";
import { RxRequestResult, MultiObservableConfigure } from "../types";
export default class MultiObservable<Data, Error> extends Observable<RxRequestResult<Data, Error>[]> {
    private subscriberConfig;
    private initialState$;
    private state$;
    private configs;
    constructor();
    private getInitialState;
    private initialStateListener;
    private stateListener;
    private subscriberConfigListener;
    configure: MultiObservableConfigure<Data, Error>;
    fetch: () => void;
}
