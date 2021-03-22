import { useCallback, useEffect, useMemo, useState } from "react";
import RxRequests from "../Observables/RxRequests";
import { useDeepCompareEffect } from "react-use";
import {
  RxRequestConfig,
  RxRequestResult,
  UseRxRequestsValue,
  RxUseRequestsOptions,
} from "../types";

export default function useRxJsRequests<Data = any, Error = any>(
  configs: RxRequestConfig[],
  {
    refetchInterval,
    fetchOnMount,
    onSuccess,
    onError,
  }: RxUseRequestsOptions<Data, Error> = {}
): UseRxRequestsValue<Data, Error> {
  const [state, setState] = useState<RxRequestResult<Data, Error>[]>([]);

  const observable = useMemo(() => new RxRequests<Data, Error>(), []);

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
