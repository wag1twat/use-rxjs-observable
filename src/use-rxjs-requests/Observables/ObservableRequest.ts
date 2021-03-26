import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
} from "axios";
import { Subscriber, Observer, Observable } from "rxjs";
import {
  CanceledRequest,
  Error,
  Loading,
  RxRequestResult,
  Success,
} from "../utils/Results";

let source: CancelTokenSource | undefined;

class SubscribeRequest<R, E> extends Subscriber<{
  [key: string]: RxRequestResult<R, E>;
}> {
  constructor(
    key: string,
    observer: Observer<RxRequestResult<R, E>>,
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

      self.next({ [key]: loading });

      if (source) {
        axiosConfig.cancelToken = source.token;
      }

      return axiosConfig;
    });

    axios
      .request(config)
      .then((response: AxiosResponse<R>) => {
        const success = new Success<typeof response>(response);

        self.next({ [key]: success });

        self.complete();
      })
      .catch((e: AxiosError<E>) => {
        if (axios.isCancel(e)) {
          const error = new CanceledRequest(e.message);

          self.next({ [key]: error });

          self.complete();
        }

        const error = new Error<typeof e>(e);

        self.next({ [key]: error });

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
      new SubscribeRequest<R, E>(key, observer, config);
    });
  }
}
