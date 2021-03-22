import { Observer, Subscriber } from "rxjs";
import axios, { AxiosRequestConfig } from "axios";
import axiosCancel from "axios-cancel";
import { RxRequestConfig, RxRequestResult } from "../types";
import {
  LoadingRxRequest,
  SuccessRxRequest,
  ErrorRxRequest,
} from "../utils/Results";

// @ts-ignore
axiosCancel(axios);

class RequestSubscribe<Data = any, Error = any> extends Subscriber<
  RxRequestResult<Data, Error>
> {
  private requestId: RxRequestConfig["requestId"];
  private url: RxRequestConfig["url"];
  private method: RxRequestConfig["method"];
  private body: RxRequestConfig["body"];
  private params: RxRequestConfig["params"];

  private state: {
    response: RxRequestResult<Data, Error>["response"];
    error: RxRequestResult<Data, Error>["error"];
  };

  private aborted: boolean;

  constructor(
    observer: Observer<RxRequestResult<Data, Error>>,
    { requestId, url, method, body, params }: RxRequestConfig,
    state: RxRequestResult<Data, Error>
  ) {
    super(observer);

    this.requestId = requestId;
    this.url = url;
    this.method = method;
    this.body = body;
    this.params = params;
    this.state = {
      response: state?.response ?? null,
      error: state?.error ?? null,
    };

    // XHR abort pointer
    this.aborted = false;

    // binding
    this.requestConfigure = this.requestConfigure.bind(this);
    this.request = this.request.bind(this);

    // make axios request on subscription

    new Promise((resolve) => {
      this.requestConfigure();

      resolve(this.request());
    });
  }

  private requestConfigure = () => {
    const self = this;

    axios.interceptors.request.use(function (config: AxiosRequestConfig) {
      const loadingRxRequest = new LoadingRxRequest<Data, Error>(
        self.state.response,
        self.state.error,
        {
          requestId: self.requestId,
          url: self.url,
          method: self.method,
          body: self.body,
          params: self.params,
        }
      );

      self.next(loadingRxRequest);

      return config;
    });
  };

  private request = async () => {
    return axios
      .request({
        url: this.url,
        method: this.method,
        // @ts-ignore
        requestId: this.requestId,
        data: this.body,
        params: this.params,
      })
      .then((response) => {
        const successRxRequest = new SuccessRxRequest<Data>(response, {
          requestId: this.requestId,
          url: this.url,
          method: this.method,
          body: this.body,
          params: this.params,
        });

        this.next(successRxRequest);

        this.complete();
      })
      .catch((error) => {
        if (error.config) {
          const errorRxRequest = new ErrorRxRequest<Error>(error, {
            requestId: this.requestId,
            url: this.url,
            method: this.method,
            body: this.body,
            params: this.params,
          });

          this.next(errorRxRequest);

          this.complete();
        }

        return null;
      });
  };

  public unsubscribe() {
    super.unsubscribe();

    // cancel XHR
    if (this.aborted === false) {
      // @ts-ignore
      axios.cancel(this.requestId);
      this.aborted = true;
    }
  }
}

export default RequestSubscribe;
