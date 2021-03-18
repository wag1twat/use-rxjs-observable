/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useState } from "react";
import { memoize } from "lodash";
import SingleObservable from "../Observables/single";
import {
  RxRequestConfig,
  RxRequestResult,
  SingleRxObservableConfig,
  UseRxRequestValue,
} from "../types";
import { useDeepCompareEffect } from "react-use";

export default function useRxJsRequest<Data = any, Error = any>(
  config: RxRequestConfig,
  {
    fetchOnUpdateConfigs,
    fetchOnUpdateConfig,
    refetchInterval,
    fetchOnMount,
    onSuccess,
    onError,
  }: SingleRxObservableConfig<Data, Error> = {}
): UseRxRequestValue<Data, Error> {
  const configMemo = useMemo(() => config, [config]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchOnUpdateConfigs,
    fetchOnUpdateConfig,
    refetchInterval,
    fetchOnMount,
    Boolean(onSuccess),
    Boolean(onError),
  ]);

  const [state, setState] = useState<Partial<RxRequestResult<Data, Error>>>({});

  const observable = useMemo(() => new SingleObservable<Data, Error>(), []);

  useDeepCompareEffect(() => {
    observable.configure(configMemo, subscriberConfigMemo);

    const subscription = observable.subscribe(setState);

    return () => subscription.unsubscribe();
  }, [observable, configMemo, subscriberConfigMemo, setState]);

  return {
    state,
    fetch: observable.fetch,
  };
}
