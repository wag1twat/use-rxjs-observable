import { RxRequestConfig, UseRxRequestsValue, RxUseRequestsOptions, State } from "../types";
export default function useRxJsRequests<T = any>(configs: RxRequestConfig<State<T>>, { refetchInterval, fetchOnMount, onSuccess, onError, }?: RxUseRequestsOptions<State<T>>): UseRxRequestsValue<Partial<State<T>>>;
