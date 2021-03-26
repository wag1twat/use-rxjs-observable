import "./App.css";
import React from "react";
import { v4 } from "uuid";
import { Box, Grid } from "@chakra-ui/react";
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

export type Todo = {
  completed: boolean;
  id: number;
  title: string;
  userId: number;
};

export type Post = {
  body: string;
  id: number;
  title: string;
  userId: number;
};

export type RequestsResult = {
  "request-01": RxRequestResult<Todo, any>;
  "request-02": RxRequestResult<Post, any>;
  "request-03": RxRequestResult<Todo, any>;
};

function App() {
  const [configs, setConfigs] = React.useState<RxRequestConfig<RequestsResult>>(
    {
      "request-01": {
        method: "get",
        url: `https://jsonplaceholder.typicode.com/todos/${1}`,
        data: { uuid: v4(), body: { uuid: v4() } },
        params: { uuid: v4(), params: { uuid: v4() } },
      },
      "request-02": {
        method: "get",
        url: `https://jsonplaceholder.typicode.com/posts/${2}`,
        data: { uuid: v4(), body: { uuid: v4() } },
        params: { uuid: v4(), params: { uuid: v4() } },
      },
      "request-03": {
        method: "get",
        url: `https://jsonplaceholder.typicode.com/todos/${3}`,
        data: { uuid: v4(), body: { uuid: v4() } },
        params: { uuid: v4(), params: { uuid: v4() } },
      },
      "request-04": {
        method: "get",
        url: `https://jsonplaceholder.typicode.com/todos/${3}`,
        data: { uuid: v4(), body: { uuid: v4() } },
        params: { uuid: v4(), params: { uuid: v4() } },
      },
    }
  );
  const { state, fetch } = useRxJsRequests<RequestsResult>(configs, {
    refetchInterval: undefined,
    fetchOnMount: false,
    onSuccess: (state) => {
      console.log("onSuccess", state);
    },
    onError: (state) => {
      console.log("onError", state);
    },
  });

  // React.useEffect(() => {
  //   fetch();
  // }, [fetch]);

  React.useEffect(() => {
    console.log("state", state);
  }, [state]);

  const updateConfigs = () => {
    setConfigs({
      ...configs,
      "request-01": {
        method: "put",
        url: `https://jsonplaceholder.typicode.com/todos/10`,
        data: { uuid: v4(), body: { uuid: v4() } },
        params: { uuid: v4(), params: { uuid: v4() } },
      },
    });
  };

  return (
    <div className="App">
      <Grid>
        <Grid gap={4} gridTemplateColumns="1fr 1fr 1fr 3fr 3fr">
          <Box p={2}>Index</Box>
          <Box p={2}>Status</Box>
          <Box p={2}>IsLoading</Box>
          <Box p={2}>Response</Box>
          <Box p={2}>Error</Box>
        </Grid>
      </Grid>
      {state["request-01"] && (
        <Grid
          gap={4}
          gridTemplateColumns="1fr 1fr 1fr 3fr 3fr"
          borderBottomWidth="1px"
          borderColor="gray.200"
        >
          <Box p={2}>
            {JSON.stringify(state["request-01"]?.status, null, 2)}
          </Box>
          <Box p={2}>
            {JSON.stringify(state["request-01"]?.isLoading, null, 2)}
          </Box>
          <Box p={2}>
            {JSON.stringify(state["request-01"]?.response?.data, null, 2)}
          </Box>
          <Box p={2}>
            {JSON.stringify(
              {
                data: state["request-01"]?.error?.response?.data,
                message: state["request-01"]?.error?.message,
              },
              null,
              2
            )}
          </Box>
        </Grid>
      )}
      {state["request-02"] && (
        <Grid
          gap={4}
          gridTemplateColumns="1fr 1fr 1fr 3fr 3fr"
          borderBottomWidth="1px"
          borderColor="gray.200"
        >
          <Box p={2}>
            {JSON.stringify(state["request-02"]?.status, null, 2)}
          </Box>
          <Box p={2}>
            {JSON.stringify(state["request-02"]?.isLoading, null, 2)}
          </Box>
          <Box p={2}>
            {JSON.stringify(state["request-02"]?.response?.data, null, 2)}
          </Box>
          <Box p={2}>
            {JSON.stringify(
              {
                data: state["request-02"]?.error?.response?.data,
                message: state["request-02"]?.error?.message,
              },
              null,
              2
            )}
          </Box>
        </Grid>
      )}
      {state["request-03"] && (
        <Grid
          gap={4}
          gridTemplateColumns="1fr 1fr 1fr 3fr 3fr"
          borderBottomWidth="1px"
          borderColor="gray.200"
        >
          <Box p={2}>
            {JSON.stringify(state["request-03"]?.status, null, 2)}
          </Box>
          <Box p={2}>
            {JSON.stringify(state["request-03"]?.isLoading, null, 2)}
          </Box>
          <Box p={2}>
            {JSON.stringify(state["request-03"]?.response?.data, null, 2)}
          </Box>
          <Box p={2}>
            {JSON.stringify(
              {
                data: state["request-03"]?.error?.response?.data,
                message: state["request-03"]?.error?.message,
              },
              null,
              2
            )}
          </Box>
        </Grid>
      )}
      {state["request-04"] && (
        <Grid
          gap={4}
          gridTemplateColumns="1fr 1fr 1fr 3fr 3fr"
          borderBottomWidth="1px"
          borderColor="gray.200"
        >
          <Box p={2}>
            {JSON.stringify(state["request-04"]?.status, null, 2)}
          </Box>
          <Box p={2}>
            {JSON.stringify(state["request-04"]?.isLoading, null, 2)}
          </Box>
          <Box p={2}>
            {JSON.stringify(state["request-04"]?.response?.data, null, 2)}
          </Box>
          <Box p={2}>
            {JSON.stringify(
              {
                data: state["request-04"]?.error?.response?.data,
                message: state["request-04"]?.error?.message,
              },
              null,
              2
            )}
          </Box>
        </Grid>
      )}
      <button style={{ margin: 10 }} onClick={updateConfigs}>
        set configs
      </button>
      <button style={{ margin: 10 }} onClick={() => fetch()}>
        fetch requests
      </button>
    </div>
  );
}

export default App;
