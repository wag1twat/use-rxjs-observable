import { AxiosResponse, AxiosError } from "axios";
export interface RxRequestResult<R = any, E = any, ID = string> {
    readonly requestId: ID;
    readonly isLoading: boolean;
    readonly status: "idle" | "loading" | "success" | "error";
    readonly response: AxiosResponse<R> | null;
    readonly error: AxiosError<E> | null;
}
export declare class Idle {
    readonly isLoading = false;
    readonly status = "idle";
    readonly response: any;
    readonly error: any;
}
export declare class Loading {
    readonly isLoading = true;
    readonly status = "loading";
    readonly response: any;
    readonly error: any;
}
export declare class Success<R> {
    readonly isLoading = false;
    readonly status = "success";
    readonly response: R | null;
    readonly error: any;
    constructor(response: R);
}
export declare class Error<E> {
    readonly isLoading = false;
    readonly status = "error";
    readonly response: any;
    readonly error: E | null;
    constructor(error: E);
}
