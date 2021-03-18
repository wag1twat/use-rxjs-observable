# Running parallel to and on the basis of a single request RxJs

## Usage single request

```javascript
import React from "react";
import {
  RxRequestConfig,
  useRxRequest,
} from "./use-rxjs-requests";
import { v4 } from "uuid";

function App() {
  const [config, setConfig] = React.useState<RxRequestConfig>({
    method: "get",
    url: "https://jsonplaceholder.typicode.com/todos/1",
    body: { uuid: v4(), body: { uuid: v4() } },
    params: { uuid: v4(), params: { uuid: v4() } },
  });

  const [options, setOptions] = React.useState({
    refetchInterval: undefined,
    fetchOnMount: false,
    fetchOnUpdateConfig: false,
    onSuccess: (success) => {
      console.log("success", success);
      },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const { state, fetch } = useRxRequest(config, options);

  React.useEffect(() => {
    fetch();
  }, [fetch]);

  React.useEffect(() => {
    console.log("state", state);
  }, [state]);

  return <div>...</div>;
}
```

## Usage parallel requests

```javascript
import React from "react";
import {
  RxRequestConfig,
  useRxRequests,
} from "./use-rxjs-requests";
import { v4 } from "uuid";

function App() {
  const [configs, setConfigs] = React.useState<RxRequestConfig>([{
    method: "get",
    url: "https://jsonplaceholder.typicode.com/todos/1",
    body: { uuid: v4(), body: { uuid: v4() } },
    params: { uuid: v4(), params: { uuid: v4() } },
  }]);

  const [options, setOptions] = React.useState({
    refetchInterval: undefined,
    fetchOnMount: false,
    fetchOnUpdateConfig: false,
  });

  const { state, fetch } = useRxRequests(configs, options);

  React.useEffect(() => {
    fetch();
  }, [fetch]);

  React.useEffect(() => {
    console.log("state", state);
  }, [state]);

  return <div>...</div>;
}