import { RxRequestConfig, MultiRxObservableConfig, UseRxRequestsValue } from "../types";
export default function useRxJsRequests<Data = any, Error = any>(configs: RxRequestConfig[], { fetchOnUpdateConfigs, fetchOnUpdateConfig, refetchInterval, fetchOnMount, onSuccess, onError, }?: MultiRxObservableConfig<Data, Error>): UseRxRequestsValue<Data, Error>;
