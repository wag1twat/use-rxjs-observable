import { RxRequestConfig, RxRequestResult } from "../types";
export declare class SuccessRxRequest<Data> implements RxRequestResult<Data, null> {
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
    constructor(response: RxRequestResult<Data, null>["response"], { requestId, url, method, body, params }: RxRequestConfig);
}
export declare class ErrorRxRequest<Error> implements RxRequestResult<null, Error> {
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
    constructor(error: RxRequestResult<null, Error>["error"], { requestId, url, method, body, params }: RxRequestConfig);
}
export declare class LoadingRxRequest<Data, Error> implements RxRequestResult<Data, Error> {
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
    constructor(response: RxRequestResult<Data, Error>["response"], error: RxRequestResult<Data, Error>["error"], { requestId, url, method, body, params }: RxRequestConfig);
}
export declare class IdleRxRequest<Data, Error> implements RxRequestResult<Data, Error> {
    readonly isLoading: false;
    readonly response: RxRequestResult<Data, Error>["response"];
    readonly error: RxRequestResult<Data, Error>["error"];
    readonly status: "idle";
    readonly requestId: string;
    readonly url: RxRequestConfig["url"];
    readonly method: RxRequestConfig["method"];
    readonly body: RxRequestConfig["body"];
    readonly params: RxRequestConfig["params"];
    readonly timestamp: Date;
    constructor(response: RxRequestResult<Data, Error>["response"], error: RxRequestResult<Data, Error>["error"], { requestId, url, method, body, params }: RxRequestConfig);
}
