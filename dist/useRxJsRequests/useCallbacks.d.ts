import { RxRequestResult, OnSuccessUseRxRequests, OnErrorUseRxRequests } from "../types";
declare type Args<Data, Error> = [
    RxRequestResult<Data, Error>[],
    OnSuccessUseRxRequests<Data>?,
    OnErrorUseRxRequests<Error>?
];
export declare function useMultiCallbacks<Data, Error>(...args: Args<Data, Error>): void;
export {};
