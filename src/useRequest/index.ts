import { useEffect, useMemo, useState } from "react";
import { Request } from "./Request";
import { Config, Handlers, Result } from "./types";

export function useRequest<R = any, E = any>(
  config: Config,
  handlers: Handlers<Result<R, E>> = {}
) {
  const [state, setState] = useState<Result<R, E> | undefined>();

  const { fetch, unsubscribe } = useMemo(() => {
    return new Request<Result<R, E>>(config, setState);
  }, [config]);

  useEffect(() => {
    if (handlers.onSuccess) {
      if (state) {
        if (state.status === "success") {
          handlers.onSuccess(state);
        }
      }
    }

    if (handlers.onError) {
      if (state) {
        if (state.status === "error") {
          handlers.onError(state);
        }
      }
    }
  }, [handlers, state]);

  useEffect(() => {
    return () => {
      unsubscribe();
    };
  }, [unsubscribe]);

  return { state, fetch };
}
