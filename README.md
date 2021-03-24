# Running parallel to and on the basis of a single request RxJs

## Usage parallel requests

```javascript
import "./App.css";
import React from "react";
import { AxiosError } from "axios";
import { v4 } from "uuid";
import {
  useRxJsRequests,
  RxRequestConfig,
  RxRequestResult,
} from "use-rxjs-requests";

type Todo = {
  completed: boolean;
  id: number;
  title: string;
  userId: number;
};

type RxRequestsState = {
  "request-01": RxRequestResult<Todo, AxiosError>;
  "request-02": RxRequestResult<Todo, AxiosError>;
  "request-03": RxRequestResult<Todo, AxiosError>;
  "request-04": RxRequestResult<Todo, AxiosError>;
};
// === or others types it's work === //
// type RxRequestsState = {
//   "request-01": RxRequestResult<TodoJob, AxiosError<TodoJobError>>;
//   "request-02": RxRequestResult<TodoJob, AxiosError<TodoJobError>>;
//   "request-03": RxRequestResult<TodoSport, AxiosError<TodoSportError>>;
//   "request-04": RxRequestResult<TodoCar, AxiosError<TodoCarError>>;
// };

function App() {
  const [configs, setConfigs] = React.useState<RxRequestConfig[]>([
    {
      requestId: "request-01",
      method: "put",
      url: "https://jsonplaceholder.typicode.com/todos/1",
      body: { uuid: v4(), body: { uuid: v4() } },
      params: { uuid: v4(), params: { uuid: v4() } },
    },
    {
      requestId: "request-02",
      method: "put",
      url: "https://jsonplaceholder.typicode.com/todos/2",
      body: { uuid: v4(), body: { uuid: v4() } },
      params: { uuid: v4(), params: { uuid: v4() } },
    },
    {
      requestId: "request-03",
      method: "put",
      url: "https://jsonplaceholder.typicode.com/todos/3",
      body: { uuid: v4(), body: { uuid: v4() } },
      params: { uuid: v4(), params: { uuid: v4() } },
    },
    {
      requestId: "request-04",
      method: "put",
      url: "https://jsonplaceholder.typicode.com/todos/4/x", // error request
      body: { uuid: v4(), body: { uuid: v4() } },
      params: { uuid: v4(), params: { uuid: v4() } },
    },
  ]);

  const { state, fetch } = useRxJsRequests<RxRequestsState>(configs, {
    refetchInterval: undefined,
    fetchOnMount: false,
    onSuccess: (state) => {
      console.log("success", state);
    },
    onError: (state) => {
      console.log("error", state);
    },
  });

  React.useEffect(() => {
    fetch();
  }, [fetch]);

  React.useEffect(() => {
    console.log("state", state);
  }, [state]);

  return <div>...</div>
```
