import { Subscriber, Subscription } from "rxjs";
import { RxRequestConfig, RxRequestResult } from "./utils";
import { RxBaseRequestsOptions } from "./options";
import { ErrorRxRequest, SuccessRxRequest } from "../utils/Results";
interface OnSuccessUseRxRequests<Data> {
    (success: SuccessRxRequest<Data>[]): void;
}
interface OnErrorUseRxRequests<Error> {
    (error: ErrorRxRequest<Error>[]): void;
}
export interface RxUseRequestsOptions<Data, Error> extends RxBaseRequestsOptions {
    onSuccess?: OnSuccessUseRxRequests<Data>;
    onError?: OnErrorUseRxRequests<Error>;
}
export interface RxRequestsOptionsListener<Data, Error> {
    (observer: Subscriber<RxRequestResult<Data, Error>[]>): Subscription;
}
export interface RxRequestsStateListener<Data, Error> {
    (observer: Subscriber<RxRequestResult<Data, Error>[]>): Subscription;
}
export interface RxRequestsFetchFn {
    (): void;
}
export interface UseRxRequestsValue<Data, Error> {
    state: RxRequestResult<Data, Error>[];
    fetch: RxRequestsFetchFn;
}
export interface RxRequestsConfigure<Data, Error> {
    (configuration: Partial<{
        configs: RxRequestConfig[];
    } & RxUseRequestsOptions<Data, Error>>): void;
}
export interface RxUseRequestsState<Data, Error> {
    [key: string]: RxRequestResult<Data, Error>;
}
export {};
