import { RxRequestConfig } from "./RxRequestConfig";
import { RxBaseRequestsOptions } from "./RxBaseRequestsOptions";
import { RxRequestResult } from "../utils/Results";

interface OnSuccessUseRxRequests<T> {
  (state: T): void;
}

interface OnErrorUseRxRequests<T> {
  (state: T): void;
}

export interface RxUseRequestsOptions<T> extends RxBaseRequestsOptions {
  onSuccess?: OnSuccessUseRxRequests<T>;
  onError?: OnErrorUseRxRequests<T>;
}

export interface RxRequestsFetchFn {
  (): void;
}

export interface UseRxRequestsValue<T> {
  state: Partial<T>;
  fetch: RxRequestsFetchFn;
}

export interface RxRequestsConfigure<T> {
  (
    configuration: Partial<
      { configs: RxRequestConfig[] } & RxUseRequestsOptions<T>
    >
  ): void;
}

export type RxRequestsState<T> = Partial<
  T & {
    [key: string]: RxRequestResult<any, any>;
  }
>;
