import { Config, Result } from "./types";
export declare function useRequest<R = any, E = any>(config: Config): {
    state: Result<R, E>;
    fetch: (axiosConfig?: import("axios").AxiosRequestConfig) => void;
};
