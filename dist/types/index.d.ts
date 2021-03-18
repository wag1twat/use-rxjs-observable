import { AxiosRequestConfig } from "axios";
import { Subscriber } from "rxjs";
import MultiObservable from "../Observables/multi";
import SingleObservable from "../Observables/single";
import { ErrorRequest, SuccessRequest } from "../utils/Results";
export interface BaseRxObservableConfig {
    fetchOnMount?: boolean;
    fetchOnUpdateConfigs?: boolean;
    fetchOnUpdateConfig?: boolean;
    refetchInterval?: number;
}
export interface MultiRxObservableConfig<Data, Error> extends BaseRxObservableConfig {
    onSuccess?: OnSuccessUseRxRequests<Data>;
    onError?: OnErrorUseRxRequests<Error>;
}
export interface SingleRxObservableConfigListener<Data, Error> {
    (observer: Subscriber<RxRequestResult<Data, Error>>): (singleRxObservableConfig: SingleRxObservableConfig<Data, Error>) => void;
}
export interface MultiRxObservableConfigListener<Data, Error> {
    (observer: Subscriber<RxRequestResult<Data, Error>[]>): (multiRxObservableConfig: MultiRxObservableConfig<Data, Error>) => void;
}
export interface SingleRxObservableStateListener<Data, Error> {
    (observer: Subscriber<RxRequestResult<Data, Error>>): (state: RxRequestResult<Data, Error>) => void;
}
export interface MultiRxObservableStateListener<Data, Error> {
    (observer: Subscriber<RxRequestResult<Data, Error>[]>): (state: {
        [key: string]: RxRequestResult<Data, Error>;
    }) => void;
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
export interface RxMutableRequestConfig extends RxRequestConfig {
    requestId: string;
}
export interface RxRequestResult<Data, Error> extends RxMutableRequestConfig, RxRequestConfig {
    isLoading: boolean;
    data: Data | null;
    error: Error | null;
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
export interface UseRxRequestsValue<Data, Error> {
    state: RxRequestResult<Data, Error>[];
    fetch: () => void;
}
export interface UseRxRequestFetchFn {
    (config?: {
        body: RxRequestConfig["body"];
        params: RxRequestConfig["params"];
    }): Promise<void>;
}
export interface UseRxRequestValue<Data, Error> {
    state: Partial<RxRequestResult<Data, Error>>;
    fetch: UseRxRequestFetchFn;
}
export interface MultiRxObservableConfigure<Data, Error> {
    (configs: RxRequestConfig[], subscriberConfig: MultiRxObservableConfig<Data, Error>): MultiObservable<Data, Error>;
}
export interface SingleRxObservableConfigure<Data, Error> {
    (configs: RxRequestConfig, subscriberConfig: SingleRxObservableConfig<Data, Error>, onSuccess?: OnSuccessUseRxRequest<Data>, onError?: OnErrorUseRxRequest<Error>): SingleObservable<Data, Error>;
}
export declare type SingleRxObservableState<Data, Error> = RxRequestResult<Data, Error>;
export interface MultiRxObservableState<Data, Error> {
    [key: string]: RxRequestResult<Data, Error>;
}
