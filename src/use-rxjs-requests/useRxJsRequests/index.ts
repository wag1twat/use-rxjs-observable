import { useCallback, useEffect, useMemo, useState } from "react";
import { useDeepCompareEffect } from "react-use";
import RxRequests from "../Observables/RxRequests";
import {
  RxRequestConfig,
  UseRxRequestsValue,
  RxUseRequestsOptions,
  RxRequestResult,
} from "../types";

type S<T> = T & { [key: string]: RxRequestResult };

export default function useRxJsRequests<T = any>(
  configs: RxRequestConfig<S<T>>,
  {
    refetchInterval,
    fetchOnMount,
    onSuccess,
    onError,
  }: RxUseRequestsOptions<S<T>> = {}
): UseRxRequestsValue<Partial<S<T>>> {
  const [state, setState] = useState<Partial<S<T>>>({} as Partial<S<T>>);

  const observable = useMemo(() => new RxRequests<S<T>>(), []);

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
