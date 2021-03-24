import { BehaviorSubject } from "rxjs";
import { RxRequestConfig, RxRequestsState, RxUseRequestsOptions } from "../types";
export declare class RxRequestsOptions<T = any> extends BehaviorSubject<Partial<{
    configs: RxRequestConfig[];
} & RxUseRequestsOptions<RxRequestsState<T>>>> {
    readonly state$: BehaviorSubject<Partial<T & {
        [key: string]: import("../utils/Results").RxRequestResult<any, any>;
    }>>;
    private interval$?;
    private onResults$;
    constructor(value: Partial<{
        configs: RxRequestConfig[];
    } & RxUseRequestsOptions<RxRequestsState<T>>>);
    readonly fetch: () => void;
    readonly next: (value: Partial<{
        configs: RxRequestConfig[];
    } & RxUseRequestsOptions<RxRequestsState<T>>>) => void;
    readonly unsubscribe: () => void;
}
