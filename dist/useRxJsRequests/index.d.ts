import { RxRequestConfig, UseRxRequestsValue, RxUseRequestsOptions } from "../types";
export default function useRxJsRequests<Data = any, Error = any>(configs: RxRequestConfig[], { refetchInterval, fetchOnMount, onSuccess, onError, }?: RxUseRequestsOptions<Data, Error>): UseRxRequestsValue<Data, Error>;
