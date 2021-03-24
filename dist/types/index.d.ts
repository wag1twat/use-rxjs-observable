import { AxiosRequestConfig } from "axios";
import { RxRequestResult } from "../utils/Results";
interface RxRequestConfig {
    requestId: string;
    url: AxiosRequestConfig["url"];
    method: AxiosRequestConfig["method"];
    body?: AxiosRequestConfig["data"];
    params?: AxiosRequestConfig["params"];
}
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
    state: Partial<T>;
    fetch: RxRequestsFetchFn;
}
interface RxRequestsConfigure<T> {
    (configuration: Partial<{
        configs: RxRequestConfig[];
    } & RxUseRequestsOptions<T>>): void;
}
declare type RxRequestsState<T> = Partial<T & {
    [key: string]: RxRequestResult<any, any>;
}>;
export type { RxRequestsState, RxUseRequestsOptions, RxRequestsFetchFn, UseRxRequestsValue, RxRequestsConfigure, RxRequestConfig, RxRequestResult, };
