import { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
export interface RxRequestConfig {
    requestId: string;
    url: AxiosRequestConfig["url"];
    method: AxiosRequestConfig["method"];
    body?: AxiosRequestConfig["data"];
    params?: AxiosRequestConfig["params"];
}
export interface RxRequestResult<Data, Error> extends RxRequestConfig {
    isLoading: boolean;
    response: AxiosResponse<Data> | null;
    error: AxiosError<Error> | null;
    status: "idle" | "success" | "loading" | "error";
    timestamp: Date;
}
