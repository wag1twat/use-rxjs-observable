import { OnErrorUseRxRequest, OnSuccessUseRxRequest, RxRequestResult } from "../types";
declare type Args<Data, Error> = [
    Partial<RxRequestResult<Data, Error>>,
    OnSuccessUseRxRequest<Data>?,
    OnErrorUseRxRequest<Error>?
];
export declare function useSingleCallbacks<Data, Error>(...args: Args<Data, Error>): void;
export {};
