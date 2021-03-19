/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useMemo, useState } from "react";
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
    fetchOnUpdateConfig,
    fetchOnUpdateConfigs,
    fetchOnMount,
    onError,
    onSuccess,
  }: SingleRxObservableConfig<Data, Error> = {}
): UseRxRequestValue<Data, Error> {
  const observable = useMemo(() => new SingleObservable<Data, Error>(), []);

  const [state, setState] = useState<Partial<RxRequestResult<Data, Error>>>({});

  useDeepCompareEffect(() => {
    observable.configure({ onError, onSuccess });
  }, [onError, onSuccess, observable.configure]);

  useDeepCompareEffect(() => {
    observable.configure({
      method,
      url,
      body,
      params,
      refetchInterval,
      fetchOnUpdateConfig,
      fetchOnUpdateConfigs,
      fetchOnMount,
    });

    const subscription = observable.subscribe(setState);

    return () => {
      subscription.unsubscribe();
    };
  }, [
    observable.configure,
    observable.subscribe,
    method,
    url,
    body,
    params,
    refetchInterval,
    fetchOnUpdateConfig,
    fetchOnUpdateConfigs,
    fetchOnMount,
  ]);

  return {
    state,
    fetch: useCallback((config) => observable.fetch(config), [
      observable.fetch,
    ]),
  };
}
