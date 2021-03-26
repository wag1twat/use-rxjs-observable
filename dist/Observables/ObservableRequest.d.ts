import { AxiosRequestConfig } from "axios";
import { Observable } from "rxjs";
import { RxRequestResult } from "../utils/Results";
export declare class ObservableRequest<R = any, E = any> extends Observable<RxRequestResult<R, E>> {
    constructor(key: string, config: AxiosRequestConfig);
}
