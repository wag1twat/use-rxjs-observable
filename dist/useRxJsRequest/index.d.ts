import { RxRequestConfig, UseRxRequestValue, RxUseRequestOptions } from "../types";
export default function useRxJsRequest<Data = any, Error = any>({ requestId, method, url, body, params }: RxRequestConfig, { refetchInterval, fetchOnMount, onError, onSuccess, }?: RxUseRequestOptions<Data, Error>): UseRxRequestValue<Data, Error>;
