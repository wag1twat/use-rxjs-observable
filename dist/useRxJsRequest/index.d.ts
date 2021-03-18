import { RxRequestConfig, SingleRxObservableConfig, UseRxRequestValue } from "../types";
export default function useRxJsRequest<Data = any, Error = any>(config: RxRequestConfig, { fetchOnUpdateConfigs, fetchOnUpdateConfig, refetchInterval, fetchOnMount, onSuccess, onError, }?: SingleRxObservableConfig<Data, Error>): UseRxRequestValue<Data, Error>;
