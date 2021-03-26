import { BehaviorSubject } from "rxjs";
import { RxRequestConfig, RxRequestsConfigureArgument, RxUseRequestsOptions } from "../types";
export declare class RxRequestsOptions<T = any> extends BehaviorSubject<RxRequestsConfigureArgument<T>> {
    readonly state$: BehaviorSubject<Partial<T>>;
    private interval$?;
    private onResults$;
    constructor(options: RxRequestsConfigureArgument<T>);
    readonly fetch: () => void;
    readonly next: (value: Partial<{
        configs: RxRequestConfig<T>;
    } & RxUseRequestsOptions<T>>) => void;
    readonly unsubscribe: () => void;
}
