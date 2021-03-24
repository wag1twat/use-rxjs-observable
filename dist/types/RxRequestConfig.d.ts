import { AxiosRequestConfig } from "axios";
export interface RxRequestConfig {
    requestId: string;
    url: AxiosRequestConfig["url"];
    method: AxiosRequestConfig["method"];
    body?: AxiosRequestConfig["data"];
    params?: AxiosRequestConfig["params"];
}
