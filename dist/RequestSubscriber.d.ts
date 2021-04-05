import { Observer, Subscriber } from "rxjs";
import { Config } from "./types";
export declare class RequestSubscriber<T> extends Subscriber<T> {
    constructor(observer: Observer<T>, config: Config);
}
