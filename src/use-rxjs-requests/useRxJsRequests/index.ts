import { useCallback, useEffect, useMemo, useState } from "react";
import { useDeepCompareEffect } from "react-use";
import RxRequests from "../Observables/RxRequests";
import {
  RxRequestConfig,
  UseRxRequestsValue,
  RxUseRequestsOptions,
  State,
} from "../types";

export default function useRxJsRequests<T = any>(
  configs: RxRequestConfig<State<T>>,
  {
    refetchInterval,
    fetchOnMount,
    onSuccess,
    onError,
  }: RxUseRequestsOptions<State<T>> = {}
): UseRxRequestsValue<Partial<State<T>>> {
  const [state, setState] = useState<Partial<State<T>>>(
    {} as Partial<State<T>>
  );

  const observable = useMemo(() => new RxRequests<State<T>>(), []);

  useEffect(() => {
    observable.configure({
      configs,
      refetchInterval,
      fetchOnMount,
      onSuccess,
      onError,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    observable.configure,
    configs,
    refetchInterval,
    fetchOnMount,
    onSuccess,
    onError,
  ]);

  useDeepCompareEffect(() => {
    const subscription = observable.subscribe(setState);

    return () => subscription.unsubscribe();
  }, [observable.subscribe]);

  return {
    state,
    fetch: useCallback(() => observable.fetch(), [observable]),
  };
}
