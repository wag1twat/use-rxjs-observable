import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
declare type ExtraConfig = {
    requestId: string;
};
declare type Config = AxiosRequestConfig & ExtraConfig;
declare type Response<R> = AxiosResponse<R>;
declare type Error<E> = AxiosError<E>;
declare type Result<R, E> = {
    status: "init" | "loading" | "success" | "error";
    isLoading: boolean;
    response: Response<R> | null;
    error: Error<E> | null;
};
declare type onSuccess<T> = {
    (state: T): void;
};
declare type onError<T> = {
    (state: T): void;
};
declare type Handlers<T> = {
    onSuccess?: onSuccess<T>;
    onError?: onError<T>;
};
export type { Config, Result, Handlers };
