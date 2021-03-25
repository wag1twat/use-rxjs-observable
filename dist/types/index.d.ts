import { AxiosRequestConfig } from "axios";
import { RxRequestResult } from "../utils/Results";
declare type C<T> = {
    [K in keyof T]: AxiosRequestConfig;
} & {
    [key: string]: AxiosRequestConfig;
};
declare type RxRequestConfig<T = any> = C<T>;
interface RxBaseRequestsOptions {
    fetchOnMount?: boolean;
    refetchInterval?: number;
}
interface OnSuccessUseRxRequests<T> {
    (state: T): void;
}
interface OnErrorUseRxRequests<T> {
    (state: T): void;
}
interface RxUseRequestsOptions<T> extends RxBaseRequestsOptions {
    onSuccess?: OnSuccessUseRxRequests<T>;
    onError?: OnErrorUseRxRequests<T>;
}
interface RxRequestsFetchFn {
    (): void;
}
interface UseRxRequestsValue<T> {
    state: T;
    fetch: RxRequestsFetchFn;
}
interface RxRequestsConfigure<T> {
    (configuration: Partial<{
        configs: RxRequestConfig<T>;
    } & RxUseRequestsOptions<T>>): void;
}
export type { RxUseRequestsOptions, RxRequestsFetchFn, UseRxRequestsValue, RxRequestsConfigure, RxRequestConfig, RxRequestResult, };
