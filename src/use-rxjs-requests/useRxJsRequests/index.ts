import { useCallback, useEffect, useMemo, useState } from "react";
import { useDeepCompareEffect } from "react-use";
import RxRequests from "../Observables/RxRequests";
import {
  RxRequestConfig,
  UseRxRequestsValue,
  RxUseRequestsOptions,
  RxRequestsState,
} from "../types";

export default function useRxJsRequests<T = any>(
  configs: RxRequestConfig[],
  {
    refetchInterval,
    fetchOnMount,
    onSuccess,
    onError,
  }: RxUseRequestsOptions<RxRequestsState<T>> = {}
): UseRxRequestsValue<RxRequestsState<T>> {
  const [state, setState] = useState<RxRequestsState<T>>({});

  const observable = useMemo(() => new RxRequests<T>(), []);

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
