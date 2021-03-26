import { AxiosResponse, AxiosError } from "axios";

export interface RxRequestResult<R = any, E = any> {
  readonly isLoading: boolean;
  readonly status: "idle" | "loading" | "success" | "error";
  readonly response: AxiosResponse<R> | null;
  readonly error: AxiosError<E> | null;
}

export class Idle {
  readonly isLoading = false;
  readonly status = "idle";
  readonly response = null;
  readonly error = null;
}

export class Loading {
  readonly isLoading = true;
  readonly status = "loading";
  readonly response = null;
  readonly error = null;
}

export class Success<R> {
  readonly isLoading = false;
  readonly status = "success";
  readonly response: R | null = null;
  readonly error = null;

  constructor(response: R) {
    this.response = response;
  }
}

export class Error<E> {
  readonly isLoading = false;
  readonly status = "error";
  readonly response = null;
  readonly error: E | null;

  constructor(error: E) {
    this.error = error;
  }
}
