import "./App.css";
import React, { useEffect, useMemo, useState } from "react";
import { reduce as lodashReduce } from "lodash";
import {
  BehaviorSubject,
  from,
  Observable,
  Observer,
  of,
  Subject,
  Subscriber,
} from "rxjs";
import { mergeMap, map, tap, distinctUntilChanged } from "rxjs/operators";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

interface RequestConfig extends AxiosRequestConfig {
  requestId: string;
}

interface RxRequestResult {
  requestId: string;
  isLoading: boolean;
  status: "init" | "loading" | "success" | "error";
  response: AxiosResponse<any> | null;
  error: AxiosError<any> | null;
}

interface RxRequestsState {
  [key: string]: RxRequestResult;
}

const requests = {
  state: new BehaviorSubject<RxRequestsState>({}),
  request: new Subject<RxRequest>(),
  configs: new Subject<RequestConfig[]>(),
  subscribe: function (
    configs: RequestConfig[],
    setState: (state: RxRequestsState) => void
  ) {
    const self = this;

    this.configs.next(configs);

    of(configs).forEach((v) => {
      const inits = lodashReduce(
        v,
        (acc, { requestId }) => ({
          ...acc,
          [requestId]: {
            requestId,
            isLoading: false,
            status: "init",
            response: null,
            error: null,
          } as RxRequestResult,
        }),
        {} as RxRequestsState
      );

      this.state.next(inits);
    });

    const state$ = this.state.pipe(distinctUntilChanged()).subscribe((v) => {
      setState(v);
    });

    const request$ = this.request
      .pipe(
        mergeMap((v) => v),
        distinctUntilChanged()
      )
      .subscribe((v) => {
        this.state.next({ ...this.state.getValue(), [v.requestId]: v });
      });

    const fetch = function () {
      of(configs)
        .pipe(
          mergeMap((v) => v),
          map((v) => new RxRequest(v)),
          distinctUntilChanged()
        )
        .forEach((v) => {
          self.request.next(v);
        });
    };

    return {
      fetch,
      unsubscribe: () => {
        state$.unsubscribe();
        request$.unsubscribe();
        self.configs.unsubscribe();
      },
    };
  },
};

const configs: RequestConfig[] = [
  {
    requestId: "1",
    url: "https://jsonplaceholder.typicode.com/posts/1",
    method: "get",
  },
  {
    requestId: "2",
    url: "https://jsonplaceholder.typicode.com/posts/2",
    method: "get",
  },
  {
    requestId: "3",
    url: "https://jsonplaceholder.typicode.com/posts/3",
    method: "get",
  },
];

class RxPromise extends Subscriber<RxRequestResult> {
  constructor(observer: Observer<RxRequestResult>, config: RequestConfig) {
    super(observer);

    const { requestId } = config;

    this.next({
      requestId,
      isLoading: false,
      status: "loading",
      response: null,
      error: null,
    });

    axios
      .request(config)
      .then((response) => {
        this.next({
          requestId,
          isLoading: false,
          status: "success",
          response,
          error: null,
        });
      })
      .catch((error) => {
        this.next({
          requestId,
          isLoading: false,
          status: "error",
          response: null,
          error,
        });
      })
      .finally(() => {
        this.complete();
      });
  }

  unsubscribe = () => {
    super.unsubscribe();
  };
}

class RxRequest extends Observable<RxRequestResult> {
  constructor(config: RequestConfig) {
    super((observer) => new RxPromise(observer, config));
  }
}

const useRequests = () => {
  const [state, setState] = useState<RxRequestsState>({});

  const { fetch, unsubscribe } = useMemo(() => {
    return requests.subscribe(configs, setState);
  }, []);

  useEffect(() => {
    return () => {
      unsubscribe();
    };
  }, [unsubscribe]);
  return { state, fetch };
};

function App() {
  const { state, fetch } = useRequests();

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    console.log("state", state);
  }, [state]);
  return <div></div>;
}

export default App;
