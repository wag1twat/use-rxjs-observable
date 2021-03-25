import { RxRequestConfig, UseRxRequestsValue, RxUseRequestsOptions, RxRequestResult } from "../types";
declare type S<T> = T & {
    [key: string]: RxRequestResult;
};
export default function useRxJsRequests<T = any>(configs: RxRequestConfig<S<T>>, { refetchInterval, fetchOnMount, onSuccess, onError, }?: RxUseRequestsOptions<S<T>>): UseRxRequestsValue<Partial<S<T>>>;
export {};
