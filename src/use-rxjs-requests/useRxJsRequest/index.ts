import { useMemo, useState } from "react";
import SingleObservable from "../Observables/single";
import {
  RxRequestConfig,
  RxRequestResult,
  RxRequestsSubscriberConfig,
  UseRxRequestValue,
} from "../types";
import { useDeepCompareEffect } from "react-use";

export default function useRxJsRequest<Data = any, Error = any>(
  config: RxRequestConfig,
  subscriberConfig: RxRequestsSubscriberConfig = {}
): UseRxRequestValue<Data, Error> {
  const [state, setState] = useState<Partial<RxRequestResult<Data, Error>>>({});

  const observable = useMemo(() => new SingleObservable<Data, Error>(), []);

  useDeepCompareEffect(() => {
    const subscription = observable
      .configure(config, subscriberConfig)
      .subscribe(setState);

    return () => subscription.unsubscribe();
  }, [observable, config, subscriberConfig, setState]);

  return {
    state,
    fetch: observable.fetch,
  };
}
