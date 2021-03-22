# Running parallel to and on the basis of a single request RxJs

## Usage single request

```javascript
import React from "react";
import { RxRequestConfig, useRxJsRequest } from "use-rxjs-requests";

function App() {
  const { state, fetch } = useRxJsRequest<AxiosResponse, AxiosError>(
    {
      method: "get",
      url: "https://jsonplaceholder.typicode.com/todos/1",
      body: { uuid: { id: 1 }, body: { uuid: { id: 1 } } },
      params: { uuid: { id: 1 }, params: { uuid: { id: 1 } } },
    },
    options
  );

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
import { RxRequestConfig, useRxJsRequests } from "use-rxjs-requests";

function App() {
  const { state, fetch } = useRxJsRequests<AxiosResponse, AxiosError>(
    [
      {
        method: "get",
        url: "https://jsonplaceholder.typicode.com/todos/1",
        body: { uuid: { id: 1 }, body: { uuid: { id: 1 } } },
        params: { uuid: { id: 1 }, params: { uuid: { id: 1 } } },
      },
      {
        method: "get",
        url: "https://jsonplaceholder.typicode.com/todos/1",
        body: { uuid: { id: 1 }, body: { uuid: { id: 1 } } },
        params: { uuid: { id: 1 }, params: { uuid: { id: 1 } } },
      },
    ],
    options
  );

  React.useEffect(() => {
    fetch();
  }, [fetch]);

  React.useEffect(() => {
    console.log("state", state);
  }, [state]);

  return <div>...</div>;
}
```
