import { useCallback, useEffect, useMemo, useState } from "react";
import SingleObservable from "../Observables/single";
import {
  RxRequestConfig,
  RxRequestResult,
  SingleRxObservableConfig,
  UseRxRequestValue,
} from "../types";
import { useDeepCompareEffect } from "react-use";

export default function useRxJsRequest<Data = any, Error = any>(
  { method, url, body, params }: RxRequestConfig,
  {
    refetchInterval,
    fetchOnMount,
    onError,
    onSuccess,
  }: SingleRxObservableConfig<Data, Error> = {}
): UseRxRequestValue<Data, Error> {
  const observable = useMemo(() => new SingleObservable<Data, Error>(), []);

  const [state, setState] = useState<Partial<RxRequestResult<Data, Error>>>({});

  useEffect(() => {
    observable.configure({
      method,
      url,
      body,
      params,
      refetchInterval,
      fetchOnMount,
      onSuccess,
      onError,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    observable.configure,
    method,
    url,
    body,
    params,
    refetchInterval,
    fetchOnMount,
    onSuccess,
    onError,
  ]);

  useDeepCompareEffect(() => {
    const subscription = observable.subscribe(setState);

    return () => {
      subscription.unsubscribe();
    };
  }, [observable.subscribe]);

  return {
    state,
    fetch: useCallback((config) => observable.fetch(config), [observable]),
  };
}
