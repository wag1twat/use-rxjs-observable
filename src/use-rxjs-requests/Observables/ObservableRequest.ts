import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import { Subscriber, Observer, Observable } from "rxjs";
import {
  CanceledRequest,
  Error,
  Loading,
  RxRequestResult,
  Success,
} from "../utils/Results";

let source: CancelTokenSource | undefined;

export class SubscribeRequest extends Subscriber<RxRequestResult> {
  constructor(
    key: string,
    observer: Observer<RxRequestResult>,
    config: AxiosRequestConfig
  ) {
    super(observer);

    const self = this;

    if (source) {
      source.cancel("Canceled previous request");
    }

    source = axios.CancelToken.source();

    axios.interceptors.request.use((axiosConfig) => {
      const loading = new Loading(null, null);

      self.next(loading);

      if (source) {
        axiosConfig.cancelToken = source.token;
      }

      return axiosConfig;
    });

    axios
      .request(config)
      .then((response) => {
        const success = new Success<typeof response>(response);
        self.next(success);

        self.complete();
      })
      .catch((e) => {
        if (axios.isCancel(e)) {
          const error = new CanceledRequest(e.message);
          self.next(error);

          self.complete();
        }

        const error = new Error<typeof e>(e);

        self.next(error);

        self.complete();
      });
  }

  unsubscribe = () => {
    super.unsubscribe();

    source = undefined;
  };
}

export class ObservableRequest<R = any, E = any> extends Observable<
  RxRequestResult<R, E>
> {
  constructor(key: string, config: AxiosRequestConfig) {
    super((observer) => {
      new SubscribeRequest(key, observer, config);
    });
  }
}
