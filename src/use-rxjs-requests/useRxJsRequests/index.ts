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
  const configsMemo = useMemo(() => configs, [configs]);

  const subscriberConfigMemo = useMemo(() => {
    return {
      fetchOnUpdateConfigs,
      fetchOnUpdateConfig,
      refetchInterval,
      fetchOnMount,
      onSuccess,
      onError,
    };
  }, [
    fetchOnUpdateConfigs,
    fetchOnUpdateConfig,
    refetchInterval,
    fetchOnMount,
    Boolean(onSuccess),
    Boolean(onError),
  ]);

  const [state, setState] = useState<RxRequestResult<Data, Error>[]>([]);

  const observable = useMemo(() => new MultiObservable<Data, Error>(), []);

  useDeepCompareEffect(() => {
    const subscription = observable
      .configure(configsMemo, subscriberConfigMemo)
      .subscribe(setState);

    return () => subscription.unsubscribe();
  }, [observable, configsMemo, subscriberConfigMemo, setState]);

  return {
    state,
    fetch: observable.fetch,
  };
}
