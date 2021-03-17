import { RxRequestConfig, RxRequestsSubscriberConfig, UseRxRequestValue } from "../types";
export default function useRxJsRequest<Data = any, Error = any>(config: RxRequestConfig, subscriberConfig?: RxRequestsSubscriberConfig): UseRxRequestValue<Data, Error>;
