import { AxiosResponse, AxiosError } from "axios";
export declare class Idle {
    readonly requestId: string;
    readonly isLoading = false;
    readonly status = "idle";
    readonly response: any;
    readonly error: any;
    constructor(requestId: string);
}
export declare class Loading {
    readonly requestId: string;
    readonly isLoading = true;
    readonly status = "loading";
    readonly response: any;
    readonly error: any;
    constructor(requestId: string);
}
export declare class Success<T> {
    readonly requestId: string;
    readonly isLoading = false;
    readonly status = "success";
    readonly response: T;
    readonly error: any;
    constructor(requestId: string, response: T);
}
export declare class Error<T> {
    readonly requestId: string;
    readonly isLoading = false;
    readonly status = "error";
    readonly response: any;
    readonly error: T;
    constructor(requestId: string, error: T);
}
export declare type RxRequestResult<D, E> = Idle | Loading | Success<AxiosResponse<D>> | Error<AxiosError<E>>;
