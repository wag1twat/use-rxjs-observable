import { RxRequestConfig, RxRequestResult } from "../types";
export declare class SuccessRequest<Data> implements RxRequestResult<Data, null> {
    readonly isLoading: false;
    readonly response: RxRequestResult<Data, null>["response"];
    readonly error: null;
    readonly status: "success";
    readonly requestId: string;
    readonly url: RxRequestConfig["url"];
    readonly method: RxRequestConfig["method"];
    readonly body: RxRequestConfig["body"];
    readonly params: RxRequestConfig["params"];
    readonly timestamp: Date;
    constructor(requestId: string, response: RxRequestResult<Data, null>["response"], { url, method, body, params }: RxRequestConfig);
}
export declare class ErrorRequest<Error> implements RxRequestResult<null, Error> {
    readonly isLoading: false;
    readonly response: null;
    readonly error: RxRequestResult<null, Error>["error"];
    readonly status: "error";
    readonly requestId: string;
    readonly url: RxRequestConfig["url"];
    readonly method: RxRequestConfig["method"];
    readonly body: RxRequestConfig["body"];
    readonly params: RxRequestConfig["params"];
    readonly timestamp: Date;
    constructor(requestId: string, error: RxRequestResult<null, Error>["error"], { url, method, body, params }: RxRequestConfig);
}
export declare class LoadingRequest<Data, Error> implements RxRequestResult<Data, Error> {
    readonly isLoading: true;
    readonly response: RxRequestResult<Data, Error>["response"];
    readonly error: RxRequestResult<Data, Error>["error"];
    readonly status: "loading";
    readonly requestId: string;
    readonly url: RxRequestConfig["url"];
    readonly method: RxRequestConfig["method"];
    readonly body: RxRequestConfig["body"];
    readonly params: RxRequestConfig["params"];
    readonly timestamp: Date;
    constructor(requestId: string, response: RxRequestResult<Data, Error>["response"], error: RxRequestResult<Data, Error>["error"], { url, method, body, params }: RxRequestConfig);
}
export declare class IdleRequest implements RxRequestResult<null, null> {
    readonly isLoading: false;
    readonly response: null;
    readonly error: null;
    readonly status: "idle";
    readonly requestId: string;
    readonly url: RxRequestConfig["url"];
    readonly method: RxRequestConfig["method"];
    readonly body: RxRequestConfig["body"];
    readonly params: RxRequestConfig["params"];
    readonly timestamp: Date;
    constructor(requestId: string, { url, method, body, params }: RxRequestConfig);
}
