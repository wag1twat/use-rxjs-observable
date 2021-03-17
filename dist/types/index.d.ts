import { AxiosRequestConfig } from "axios";
import MultiObservable from "../Observables/multi";
import SingleObservable from "../Observables/single";
export interface RxRequestsSubscriberConfig {
    fetchOnMount?: boolean;
    fetchOnUpdateConfigs?: boolean;
    fetchOnUpdateConfig?: boolean;
    refetchInterval?: number;
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
}
export interface UseRxRequestsValue<Data, Error> {
    state: RxRequestResult<Data, Error>[];
    fetch: () => void;
}
export interface UseRxRequestValue<Data, Error> {
    state: Partial<RxRequestResult<Data, Error>>;
    fetch: () => void;
}
export interface MultiObservableConfigure<Data, Error> {
    (configs: RxRequestConfig[], subscriberConfig: RxRequestsSubscriberConfig): MultiObservable<Data, Error>;
}
export interface SingleObservableConfigure<Data, Error> {
    (configs: RxRequestConfig, subscriberConfig: RxRequestsSubscriberConfig): SingleObservable<Data, Error>;
}
