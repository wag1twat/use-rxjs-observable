import axios from "axios";
import { Observer, Subscriber } from "rxjs";
import { Error, Loading, Success } from "./result";
import { Config } from "./types";

export class RequestSubscriber<T> extends Subscriber<T> {
  constructor(observer: Observer<T>, config: Config) {
    super(observer);

    axios.interceptors.request.use((axiosConfig) => {
      this.next(Loading<T>());
      return axiosConfig;
    });

    axios
      .request(config)
      .then((response) => {
        this.next(Success<T>(response));
      })
      .catch((error) => {
        this.next(Error<T>(error));
      })
      .finally(() => {
        this.complete();
      });
  }
}
