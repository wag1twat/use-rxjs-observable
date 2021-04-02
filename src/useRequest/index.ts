import { useEffect, useMemo, useState } from "react";
import { Request } from "./Request";
import { Config, Result } from "./types";

export function useRequest<R = any, E = any>(config: Config) {
  const [state, setState] = useState<Result<R, E> | undefined>();

  const { fetch, unsubscribe } = useMemo(() => {
    return new Request<Result<R, E>>(config, setState);
  }, [config]);

  useEffect(() => {
    return () => {
      unsubscribe();
    };
  }, [unsubscribe]);

  return { state, fetch };
}
