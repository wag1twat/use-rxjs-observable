import { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { Subscriber, Subscription } from "rxjs";
import { ErrorRequest, SuccessRequest } from "../utils/Results";
export interface BaseRxObservableConfig {
    fetchOnMount?: boolean;
    refetchInterval?: number;
}
export interface MultiRxObservableConfig<Data, Error> extends BaseRxObservableConfig {
    onSuccess?: OnSuccessUseRxRequests<Data>;
    onError?: OnErrorUseRxRequests<Error>;
}
export interface SingleRxObservableStateListener<Data, Error> {
    (observer: Subscriber<RxRequestResult<Data, Error>>): Subscription;
}
export interface SingleObservableConfigurationListener<Data, Error> {
    (observer: Subscriber<RxRequestResult<Data, Error>>): Subscription;
}
export interface MultiObservableConfigurationListener<Data, Error> {
    (observer: Subscriber<RxRequestResult<Data, Error>[]>): (configuration: Partial<{
        configs: (RxRequestConfig & {
            requestId: string;
        })[];
    } & MultiRxObservableConfig<Data, Error>>) => void;
}
export interface MultiRxObservableStateListener<Data, Error> {
    (observer: Subscriber<RxRequestResult<Data, Error>[]>): void;
}
export interface SingleRxObservableConfig<Data, Error> extends BaseRxObservableConfig {
    onSuccess?: OnSuccessUseRxRequest<Data>;
    onError?: OnErrorUseRxRequest<Error>;
}
export interface RxRequestConfig {
    url: AxiosRequestConfig["url"];
    method: AxiosRequestConfig["method"];
    body?: AxiosRequestConfig["data"];
    params?: AxiosRequestConfig["params"];
}
export interface RxRequestConfigRequestId extends RxRequestConfig {
    requestId: string;
}
export interface RxRequestResult<Data, Error> extends RxRequestConfigRequestId, RxRequestConfig {
    isLoading: boolean;
    response: AxiosResponse<Data> | null;
    error: AxiosError<Error> | null;
    status: "idle" | "success" | "loading" | "error";
    timestamp: Date;
}
export interface OnSuccessUseRxRequests<Data> {
    (success: SuccessRequest<Data>[]): void;
}
export interface OnErrorUseRxRequests<Error> {
    (error: ErrorRequest<Error>[]): void;
}
export interface OnSuccessUseRxRequest<Data> {
    (success: SuccessRequest<Data>): void;
}
export interface OnErrorUseRxRequest<Error> {
    (error: ErrorRequest<Error>): void;
}
export interface UseRxRequestsFetchFn {
    (): void;
}
export interface UseRxRequestsValue<Data, Error> {
    state: RxRequestResult<Data, Error>[];
    fetch: UseRxRequestsFetchFn;
}
export interface UseRxRequestFetchFn {
    (config?: {
        body?: RxRequestConfig["body"];
        params?: RxRequestConfig["params"];
    }): Promise<void>;
}
export interface UseRxRequestValue<Data, Error> {
    state: Partial<RxRequestResult<Data, Error>>;
    fetch: UseRxRequestFetchFn;
}
export interface MultiRxObservableConfigure<Data, Error> {
    (configuration: Partial<{
        configs: RxRequestConfig[];
    } & MultiRxObservableConfig<Data, Error>>): void;
}
export interface SingleRxObservableConfigure<Data, Error> {
    (configuration: Partial<RxRequestConfig & SingleRxObservableConfig<Data, Error>>): void;
}
export declare type SingleRxObservableState<Data, Error> = RxRequestResult<Data, Error>;
export interface MultiRxObservableState<Data, Error> {
    [key: string]: RxRequestResult<Data, Error>;
}
