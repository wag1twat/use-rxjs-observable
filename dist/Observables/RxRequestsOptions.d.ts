import { BehaviorSubject } from "rxjs";
import { RxRequestConfig, RxUseRequestsOptions } from "../types";
export declare class RxRequestsOptions<T = any> extends BehaviorSubject<Partial<{
    configs: RxRequestConfig<T>;
} & RxUseRequestsOptions<T>>> {
    readonly state$: BehaviorSubject<Partial<T>>;
    private interval$?;
    private onResults$;
    constructor(value: Partial<{
        configs: RxRequestConfig<T>;
    } & RxUseRequestsOptions<T>>);
    readonly fetch: () => void;
    readonly next: (value: Partial<{
        configs: RxRequestConfig<T>;
    } & RxUseRequestsOptions<T>>) => void;
    readonly unsubscribe: () => void;
}
