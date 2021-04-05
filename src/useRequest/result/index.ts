import { Result } from "../types";

export function Init<T>(): T {
  return (({
    status: "init",
    isLoading: false,
    response: null,
    error: null,
  } as Result<any, any>) as unknown) as T;
}
export function Loading<T>(): T {
  return (({
    status: "loading",
    isLoading: true,
    response: null,
    error: null,
  } as Result<any, any>) as unknown) as T;
}
export function Success<T>(response: any): T {
  return (({
    status: "success",
    isLoading: true,
    response,
    error: null,
  } as Result<any, any>) as unknown) as T;
}
export function Error<T>(error: any): T {
  return (({
    status: "error",
    isLoading: true,
    response: null,
    error,
  } as Result<any, any>) as unknown) as T;
}
