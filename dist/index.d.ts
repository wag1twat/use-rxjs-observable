import { Config, Handlers, Result } from "./types";
export declare function useRequest<R = any, E = any>(config: Config, handlers?: Handlers<Result<R, E>>): {
    state: Result<R, E>;
    fetch: (axiosConfig?: import("axios").AxiosRequestConfig) => void;
};
