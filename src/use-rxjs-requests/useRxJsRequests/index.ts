import { useMemo, useState } from "react";
import MultiObservable from "../Observables/multi";
import {
  RxRequestConfig,
  RxRequestResult,
  RxRequestsSubscriberConfig,
  UseRxRequestsValue,
} from "../types";
import { useDeepCompareEffect, createMemo } from "react-use";

export default function useRxJsRequests<Data = any, Error = any>(
  configs: RxRequestConfig[],
  subscriberConfig: RxRequestsSubscriberConfig = {}
): UseRxRequestsValue<Data, Error> {
  const _configs = createMemo((configs) => configs)(configs);

  const _subscriberConfig = createMemo((subscriberConfig) => subscriberConfig)(
    subscriberConfig
  );

  const [state, setState] = useState<RxRequestResult<Data, Error>[]>([]);

  const observable = useMemo(() => new MultiObservable<Data, Error>(), []);

  useDeepCompareEffect(() => {
    const subscription = observable
      .configure(_configs, _subscriberConfig)
      .subscribe(setState);

    return () => subscription.unsubscribe();
  }, [observable, _configs, _subscriberConfig, setState]);

  return {
    state,
    fetch: observable.fetch,
  };
}
