/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useState } from "react";
import MultiObservable from "../Observables/multi";
import {
  RxRequestConfig,
  RxRequestResult,
  MultiRxObservableConfig,
  UseRxRequestsValue,
} from "../types";
import { useDeepCompareEffect } from "react-use";

export default function useRxJsRequests<Data = any, Error = any>(
  configs: RxRequestConfig[],
  {
    fetchOnUpdateConfigs,
    fetchOnUpdateConfig,
    refetchInterval,
    fetchOnMount,
    onSuccess,
    onError,
  }: MultiRxObservableConfig<Data, Error> = {}
): UseRxRequestsValue<Data, Error> {
  const [state, setState] = useState<RxRequestResult<Data, Error>[]>([]);

  const observable = useMemo(() => new MultiObservable<Data, Error>(), []);

  useDeepCompareEffect(() => {
    observable.configure({ onSuccess, onError });
  }, [observable.configure, onSuccess, onError]);

  useDeepCompareEffect(() => {
    observable.configure({
      configs,
      fetchOnUpdateConfigs,
      fetchOnUpdateConfig,
      refetchInterval,
      fetchOnMount,
    });

    const subscription = observable.subscribe(setState);

    return () => subscription.unsubscribe();
  }, [
    observable,
    configs,
    fetchOnUpdateConfigs,
    fetchOnUpdateConfig,
    refetchInterval,
    fetchOnMount,
    setState,
  ]);

  return {
    state,
    fetch: observable.fetch,
  };
}
