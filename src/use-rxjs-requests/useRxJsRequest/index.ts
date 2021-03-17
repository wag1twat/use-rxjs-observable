import { useMemo, useState } from "react";
import SingleObservable from "../Observables/single";
import {
  RxRequestConfig,
  RxRequestResult,
  RxRequestsSubscriberConfig,
  UseRxRequestValue,
} from "../types";
import { useDeepCompareEffect, createMemo } from "react-use";

export default function useRxJsRequest<Data = any, Error = any>(
  config: RxRequestConfig,
  subscriberConfig: RxRequestsSubscriberConfig = {}
): UseRxRequestValue<Data, Error> {
  const _config = createMemo((config) => config)(config);

  const _subscriberConfig = createMemo((subscriberConfig) => subscriberConfig)(
    subscriberConfig
  );

  const [state, setState] = useState<Partial<RxRequestResult<Data, Error>>>({});

  const observable = useMemo(() => new SingleObservable<Data, Error>(), []);

  useDeepCompareEffect(() => {
    observable.configure(_config, _subscriberConfig);

    const subscription = observable.subscribe(setState);

    return () => subscription.unsubscribe();
  }, [observable, _config, _subscriberConfig, setState]);

  return {
    state,
    fetch: observable.fetch,
  };
}
