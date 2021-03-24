import { AxiosResponse, AxiosError } from "axios";

export class Idle {
  readonly requestId: string;
  readonly isLoading = false;
  readonly status = "idle";
  readonly response = null;
  readonly error = null;

  constructor(requestId: string) {
    this.requestId = requestId;
  }
}

export class Loading {
  readonly requestId: string;
  readonly isLoading = true;
  readonly status = "loading";
  readonly response = null;
  readonly error = null;

  constructor(requestId: string) {
    this.requestId = requestId;
  }
}

export class Success<T> {
  readonly requestId: string;
  readonly isLoading = false;
  readonly status = "success";
  readonly response: T;
  readonly error = null;

  constructor(requestId: string, response: T) {
    this.requestId = requestId;
    this.response = response;
  }
}

export class Error<T> {
  readonly requestId: string;
  readonly isLoading = false;
  readonly status = "error";
  readonly response = null;
  readonly error: T;

  constructor(requestId: string, error: T) {
    this.requestId = requestId;
    this.error = error;
  }
}

export type RxRequestResult<D, E> =
  | Idle
  | Loading
  | Success<AxiosResponse<D>>
  | Error<AxiosError<E>>;
