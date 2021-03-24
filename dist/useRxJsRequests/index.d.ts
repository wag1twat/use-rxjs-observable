import { RxRequestConfig, UseRxRequestsValue, RxUseRequestsOptions, RxRequestsState } from "../types";
export default function useRxJsRequests<T = any>(configs: RxRequestConfig[], { refetchInterval, fetchOnMount, onSuccess, onError, }?: RxUseRequestsOptions<RxRequestsState<T>>): UseRxRequestsValue<RxRequestsState<T>>;
