import "./App.css";
import React from "react";
import { AxiosError } from "axios";
import { v4 } from "uuid";
// import {
//   useRxJsRequests,
//   RxRequestConfig,
//   RxRequestResult,
// } from "./use-rxjs-requests";
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
  "request-02": RxRequestResult<Todo, any>;
  "request-03": RxRequestResult<Todo, any>;
};

function App() {
  const [configs, setConfigs] = React.useState<RxRequestConfig[]>([
    {
      requestId: "request-02",
      method: "put",
      url: "https://jsonplaceholder.typicode.com/todos/1",
      body: { uuid: v4(), body: { uuid: v4() } },
      params: { uuid: v4(), params: { uuid: v4() } },
    },
    {
      requestId: "request-03",
      method: "put",
      url: "https://jsonplaceholder.typicode.com/todos/2",
      body: { uuid: v4(), body: { uuid: v4() } },
      params: { uuid: v4(), params: { uuid: v4() } },
    },
    {
      requestId: "request-04",
      method: "put",
      url: "https://jsonplaceholder.typicode.com/todos/3",
      body: { uuid: v4(), body: { uuid: v4() } },
      params: { uuid: v4(), params: { uuid: v4() } },
    },
    {
      requestId: "request-05",
      method: "put",
      url: "https://jsonplaceholder.typicode.com/todos/4/x",
      body: { uuid: v4(), body: { uuid: v4() } },
      params: { uuid: v4(), params: { uuid: v4() } },
    },
  ]);

  const { state, fetch } = useRxJsRequests<RxRequestsState>(configs, {
    refetchInterval: undefined,
    fetchOnMount: false,
    onSuccess: (state) => {
      console.log("success", state["request-02"]);
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

  return (
    <div className="App">
      <button
        style={{ margin: 10 }}
        onClick={() => {
          setConfigs([
            {
              requestId: "request-02",
              method: "put",
              url: "https://jsonplaceholder.typicode.com/todos/1",
              body: { uuid: v4(), body: { uuid: v4() } },
              params: { uuid: v4(), params: { uuid: v4() } },
            },
            {
              requestId: "request-03",
              method: "put",
              url: "https://jsonplaceholder.typicode.com/todos/2",
              body: { uuid: v4(), body: { uuid: v4() } },
              params: { uuid: v4(), params: { uuid: v4() } },
            },
            {
              requestId: "request-04",
              method: "put",
              url: "https://jsonplaceholder.typicode.com/todos/1/x",
              body: { uuid: v4(), body: { uuid: v4() } },
              params: { uuid: v4(), params: { uuid: v4() } },
            },
            {
              requestId: "request-05",
              method: "put",
              url: "https://jsonplaceholder.typicode.com/todos/1/x",
              body: { uuid: v4(), body: { uuid: v4() } },
              params: { uuid: v4(), params: { uuid: v4() } },
            },
          ]);
        }}
      >
        set configs
      </button>
      <button style={{ margin: 10 }} onClick={() => fetch()}>
        fetch requests
      </button>
      {Object.values(state).map((res) => {
        return (
          <div
            key={res?.requestId}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 2fr 2fr 2fr 2fr",
              gap: "10px",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", padding: 10 }}
            >
              <div style={{ color: "red" }}>REQUEST ID</div>
              <code>{res?.requestId}</code>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", padding: 10 }}
            >
              <div style={{ color: "red" }}>STATUS</div>
              <code>{res?.status}</code>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", padding: 10 }}
            >
              <div style={{ color: "red" }}>DATA</div>
              <code>{JSON.stringify(res?.response?.data, null, 2)}</code>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", padding: 10 }}
            >
              <div style={{ color: "red" }}>ERROR</div>
              <code>{JSON.stringify(res?.error?.message, null, 2)}</code>
            </div>
            {/* <div
              style={{ display: "flex", flexDirection: "column", padding: 10 }}
            >
              <div style={{ color: "red" }}>BODY</div>
              <code>{JSON.stringify(res.body, null, 2)}</code>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", padding: 10 }}
            >
              <div style={{ color: "red" }}>PARAMS</div>
              <code>{JSON.stringify(res.params, null, 2)}</code>
            </div> */}
          </div>
        );
      })}
    </div>
  );
}

export default App;
