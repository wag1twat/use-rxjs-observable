import { RxRequestConfig, UseRxRequestValue, RxUseRequestOptions } from "../types";
export default function useRxJsRequest<Data = any, Error = any>({ method, url, body, params }: RxRequestConfig, { refetchInterval, fetchOnMount, onError, onSuccess, }?: RxUseRequestOptions<Data, Error>): UseRxRequestValue<Data, Error>;
