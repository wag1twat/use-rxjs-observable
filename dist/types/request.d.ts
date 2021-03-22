import { Subscriber, Subscription } from "rxjs";
import { ErrorRxRequest, SuccessRxRequest } from "../utils/Results";
import { RxBaseRequestsOptions } from "./options";
import { RxRequestConfig, RxRequestResult } from "./utils";
interface OnSuccessUseRxRequest<Data> {
    (success: SuccessRxRequest<Data>): void;
}
interface OnErrorUseRxRequest<Error> {
    (error: ErrorRxRequest<Error>): void;
}
export interface RxUseRequestOptions<Data, Error> extends RxBaseRequestsOptions {
    onSuccess?: OnSuccessUseRxRequest<Data>;
    onError?: OnErrorUseRxRequest<Error>;
}
export interface RxRequestStateListener<Data, Error> {
    (observer: Subscriber<RxRequestResult<Data, Error>>): Subscription;
}
export interface RxRequestOptionsListener<Data, Error> {
    (observer: Subscriber<RxRequestResult<Data, Error>>): Subscription;
}
export interface RxRequestFetchFn {
    (config?: {
        body?: RxRequestConfig["body"];
        params?: RxRequestConfig["params"];
    }): Promise<void>;
}
export interface UseRxRequestValue<Data, Error> {
    state: Partial<RxRequestResult<Data, Error>>;
    fetch: RxRequestFetchFn;
}
export interface RxRequestConfigure<Data, Error> {
    (configuration: Partial<RxRequestConfig & RxUseRequestOptions<Data, Error>>): void;
}
export declare type RxUseRequestState<Data, Error> = RxRequestResult<Data, Error>;
export {};
