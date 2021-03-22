import { Observer, Subscriber } from "rxjs";
import { RxRequestConfigRequestId, RxRequestResult } from "../types";
declare class RequestSubscribe<Data = any, Error = any> extends Subscriber<RxRequestResult<Data, Error>> {
    private requestId;
    private url;
    private method;
    private body;
    private params;
    private state;
    private aborted;
    constructor(observer: Observer<RxRequestResult<Data, Error>>, { requestId, url, method, body, params }: RxRequestConfigRequestId, state: RxRequestResult<Data, Error>);
    private requestConfigure;
    private request;
    unsubscribe(): void;
}
export default RequestSubscribe;
