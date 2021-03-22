import { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
export interface RxRequestConfig {
    url: AxiosRequestConfig["url"];
    method: AxiosRequestConfig["method"];
    body?: AxiosRequestConfig["data"];
    params?: AxiosRequestConfig["params"];
}
export interface RxRequestConfigRequestId extends RxRequestConfig {
    requestId: string;
}
export interface RxRequestResult<Data, Error> extends RxRequestConfigRequestId, RxRequestConfig {
    isLoading: boolean;
    response: AxiosResponse<Data> | null;
    error: AxiosError<Error> | null;
    status: "idle" | "success" | "loading" | "error";
    timestamp: Date;
}
