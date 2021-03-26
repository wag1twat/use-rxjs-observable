import { AxiosRequestConfig } from "axios";
import { RxRequestResult } from "../utils/Results";

type State<T> = T & { [key: string]: RxRequestResult };

type RxRequestConfig<T = any> = { [K in keyof T]: AxiosRequestConfig } & {
  [key: string]: AxiosRequestConfig;
};

interface RxBaseRequestsOptions {
  fetchOnMount?: boolean;
  refetchInterval?: number;
}

interface OnSuccessUseRxRequests<T> {
  (state: T): void;
}

interface OnErrorUseRxRequests<T> {
  (state: T): void;
}

interface RxUseRequestsOptions<T> extends RxBaseRequestsOptions {
  onSuccess?: OnSuccessUseRxRequests<T>;
  onError?: OnErrorUseRxRequests<T>;
}

interface RxRequestsFetchFn {
  (): void;
}

interface UseRxRequestsValue<T> {
  state: T;
  fetch: RxRequestsFetchFn;
}

type RxRequestsConfigureArgument<T> = Partial<
  { configs: RxRequestConfig<T> } & RxUseRequestsOptions<T>
>;

interface RxRequestsConfigure<T> {
  (options: RxRequestsConfigureArgument<T>): void;
}

export type {
  State,
  RxRequestsConfigureArgument,
  RxUseRequestsOptions,
  RxRequestsFetchFn,
  UseRxRequestsValue,
  RxRequestsConfigure,
  RxRequestConfig,
  RxRequestResult,
};
