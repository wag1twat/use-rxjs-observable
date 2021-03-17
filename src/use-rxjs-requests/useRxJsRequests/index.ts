import { useMemo, useState } from "react";
import MultiObservable from "../Observables/multi";
import {
  RxRequestConfig,
  RxRequestResult,
  RxRequestsSubscriberConfig,
  UseRxRequestsValue,
} from "../types";
import { useDeepCompareEffect } from "react-use";

export default function useRxJsRequests<Data = any, Error = any>(
  configs: RxRequestConfig[],
  subscriberConfig: RxRequestsSubscriberConfig
): UseRxRequestsValue<Data, Error> {
  const [state, setState] = useState<RxRequestResult<Data, Error>[]>([]);

  const observable = useMemo(() => new MultiObservable<Data, Error>(), []);

  useDeepCompareEffect(() => {
    const subscription = observable
      .configure(configs, subscriberConfig)
      .subscribe(setState);

    return () => subscription.unsubscribe();
  }, [observable, configs, subscriberConfig, setState]);

  return {
    state,
    fetch: observable.fetch,
  };
}
