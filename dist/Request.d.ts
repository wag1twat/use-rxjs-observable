import { AxiosRequestConfig } from "axios";
import { Subscriber } from "rxjs";
import { Config } from "./types";
export declare class Request<T> extends Subscriber<T> {
    readonly fetch: (axiosConfig?: AxiosRequestConfig) => void;
    private config$;
    private subscription?;
    constructor(config: Config, updater: (result: T) => void);
    unsubscribe: () => void;
}
