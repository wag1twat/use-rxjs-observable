import "./App.css";
import React from "react";
import useRxJsRequest from "./use-rxjs-requests/useRxJsRequest";
import useRxJsRequests from "./use-rxjs-requests/useRxJsRequests";
import { RxRequestConfig } from "./use-rxjs-requests";
import { v4 } from "uuid";
// import {
//   RxRequestConfig,
//   useRxJsRequest,
//   useRxJsRequests,
// } from "use-rxjs-requests";

function App() {
  const [config, setConfig] = React.useState<RxRequestConfig>({
    requestId: "request-01",
    method: "put",
    url: "https://jsonplaceholder.typicode.com/todos/1",
    body: { uuid: v4(), body: { uuid: v4() } },
    params: { uuid: v4(), params: { uuid: v4() } },
  });

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
      url: "https://jsonplaceholder.typicode.com/todos/1/x",
      body: { uuid: v4(), body: { uuid: v4() } },
      params: { uuid: v4(), params: { uuid: v4() } },
    },
  ]);

  const { state, fetch } = useRxJsRequest(config, {
    refetchInterval: undefined,
    fetchOnMount: false,
    onSuccess: (success) => {
      console.log("success", success);
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const { state: result, fetch: request } = useRxJsRequests(configs, {
    refetchInterval: undefined,
    fetchOnMount: false,
    onSuccess: (success) => {
      console.log("success", success);
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  // React.useEffect(() => {
  //   fetch();
  // }, [config, fetch]);

  // React.useEffect(() => {
  //   console.log("state", state);
  // }, [state]);

  // React.useEffect(() => {
  //   request();
  // }, [request]);

  // React.useEffect(() => {
  //   console.log("result", result);
  // }, [result]);

  return (
    <div className="App">
      <button
        style={{ margin: 10 }}
        onClick={() => {
          setConfig({
            requestId: "request-01",
            method: "put",
            url: "https://jsonplaceholder.typicode.com/todos/1",
            body: { uuid: v4(), body: { uuid: v4() } },
            params: { uuid: v4(), params: { uuid: v4() } },
          });
        }}
      >
        set config
      </button>
      <button style={{ margin: 10 }} onClick={() => fetch()}>
        fetch request
      </button>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
        <div
          key={state.requestId}
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
            <code>{state.requestId}</code>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", padding: 10 }}
          >
            <div style={{ color: "red" }}>STATUS</div>
            <code>{state.status}</code>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", padding: 10 }}
          >
            <div style={{ color: "red" }}>DATA</div>
            <code>{JSON.stringify(state.response, null, 2)}</code>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", padding: 10 }}
          >
            <div style={{ color: "red" }}>ERROR</div>
            <code>{JSON.stringify(state.error, null, 2)}</code>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", padding: 10 }}
          >
            <div style={{ color: "red" }}>BODY</div>
            <code>{JSON.stringify(state.body, null, 2)}</code>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", padding: 10 }}
          >
            <div style={{ color: "red" }}>PARAMS</div>
            <code>{JSON.stringify(state.params, null, 2)}</code>
          </div>
        </div>
      </div>
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
      <button style={{ margin: 10 }} onClick={() => request()}>
        fetch requests
      </button>
      {result.map((res) => {
        return (
          <div
            key={res.requestId}
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
              <code>{res.requestId}</code>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", padding: 10 }}
            >
              <div style={{ color: "red" }}>STATUS</div>
              <code>{res.status}</code>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", padding: 10 }}
            >
              <div style={{ color: "red" }}>DATA</div>
              <code>{JSON.stringify(res.response, null, 2)}</code>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", padding: 10 }}
            >
              <div style={{ color: "red" }}>ERROR</div>
              <code>{JSON.stringify(res.error, null, 2)}</code>
            </div>
            <div
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
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default App;
