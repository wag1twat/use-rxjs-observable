import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

type ExtraConfig = {
  requestId: string;
};

type Config = AxiosRequestConfig & ExtraConfig;

type Response<R> = AxiosResponse<R>;

type Error<E> = AxiosError<E>;

type Result<R, E> = {
  status: "init" | "loading" | "success" | "error";
  isLoading: boolean;
  response: Response<R> | null;
  error: Error<E> | null;
};

export type { Config, Result };
