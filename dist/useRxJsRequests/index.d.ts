import { RxRequestConfig, RxRequestsSubscriberConfig, UseRxRequestsValue } from "../types";
export default function useRxJsRequests<Data = any, Error = any>(configs: RxRequestConfig[], subscriberConfig: RxRequestsSubscriberConfig): UseRxRequestsValue<Data, Error>;
