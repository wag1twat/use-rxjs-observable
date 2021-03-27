import "./App.css";
import React from "react";
import { v4 } from "uuid";
import { Box, Button, Grid } from "@chakra-ui/react";
import {
  useRxJsRequests,
  RxRequestConfig,
  RxRequestResult,
} from "./use-rxjs-requests";
import useRequests, { RxRequestConfig as Config } from "./test-features";
// import {
//   useRxJsRequests,
//   RxRequestConfig,
//   RxRequestResult,
// } from "use-rxjs-requests";

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
  request1: RxRequestResult<Todo, any>;
  request2: RxRequestResult<Post, any>;
  request3: RxRequestResult<Todo, any>;
  request4: RxRequestResult<Todo, any>;
};

export type Result = {
  requetId1: RxRequestResult<Todo, any>;
  requetId2: RxRequestResult<Post, any>;
  requetId3: RxRequestResult<Todo, any>;
  requetId4: RxRequestResult<Todo, any>;
};

function App() {
  const cfgs: Config[] = [
    {
      requetId: "requetId1",
      method: "put",
      url: `https://jsonplaceholder.typicode.com/todos/${1}`,
      data: { uuid: v4(), body: { uuid: v4() } },
      params: { uuid: v4(), params: { uuid: v4() } },
    },
    {
      requetId: "requetId2",
      method: "put",
      url: `https://jsonplaceholder.typicode.com/todos/${2}`,
      data: { uuid: v4(), body: { uuid: v4() } },
      params: { uuid: v4(), params: { uuid: v4() } },
    },
    {
      requetId: "requetId3",
      method: "put",
      url: `https://jsonplaceholder.typicode.com/todos/${3}`,
      data: { uuid: v4(), body: { uuid: v4() } },
      params: { uuid: v4(), params: { uuid: v4() } },
    },
    {
      requetId: "requetId4",
      method: "put",
      url: `https://jsonplaceholder.typicode.com/todos/${4}/x`,
      data: { uuid: v4(), body: { uuid: v4() } },
      params: { uuid: v4(), params: { uuid: v4() } },
    },
  ];

  const { fetch: get, state } = useRequests<Result>(cfgs);

  const [configs, setConfigs] = React.useState<RxRequestConfig<RequestsResult>>(
    {
      request1: {
        method: "put",
        url: `https://jsonplaceholder.typicode.com/todos/${1}`,
        data: { uuid: v4(), body: { uuid: v4() } },
        params: { uuid: v4(), params: { uuid: v4() } },
      },
      request2: {
        method: "put",
        url: `https://jsonplaceholder.typicode.com/posts/${2}`,
        data: { uuid: v4(), body: { uuid: v4() } },
        params: { uuid: v4(), params: { uuid: v4() } },
      },
      request3: {
        method: "put",
        url: `https://jsonplaceholder.typicode.com/todos/${3}`,
        data: { uuid: v4(), body: { uuid: v4() } },
        params: { uuid: v4(), params: { uuid: v4() } },
      },
      request4: {
        method: "put",
        url: `https://jsonplaceholder.typicode.com/todos/${4}`,
        data: { uuid: v4(), body: { uuid: v4() } },
        params: { uuid: v4(), params: { uuid: v4() } },
      },
      request5: {
        method: "put",
        url: `https://jsonplaceholder.typicode.com/todos/${5}/x`,
        data: { uuid: v4(), body: { uuid: v4() } },
        params: { uuid: v4(), params: { uuid: v4() } },
      },
    }
  );
  // const { state, fetch } = useRxJsRequests<RequestsResult>(configs, {
  //   refetchInterval: undefined,
  //   fetchOnMount: false,
  //   onSuccess: (state) => {
  //     console.log("onSuccess", state);
  //   },
  //   onError: (state) => {
  //     console.log("onError", state);
  //   },
  // });

  // React.useEffect(() => {
  //   fetch();
  // }, [fetch]);

  // React.useEffect(() => {
  //   console.log("state", state);
  // }, [state]);

  // const updateConfigs = () => {
  //   setConfigs({
  //     ...configs,
  //     request1: {
  //       method: "put",
  //       url: `https://jsonplaceholder.typicode.com/todos/10`,
  //       data: { uuid: v4(), body: { uuid: v4() } },
  //       params: { uuid: v4(), params: { uuid: v4() } },
  //     },
  //   });
  // };

  React.useEffect(() => {}, [state]);
  return (
    <div className="App">
      <Grid>
        <Grid gap={4} gridTemplateColumns="1fr 1fr 1fr 3fr 3fr">
          <Box p={2}>Status</Box>
          <Box p={2}>IsLoading</Box>
          <Box p={2}>Response</Box>
          <Box p={2}>Error</Box>
        </Grid>
      </Grid>
      {/* {state.request1 && (
        <Grid
          gap={4}
          gridTemplateColumns="1fr 1fr 1fr 3fr 3fr"
          borderBottomWidth="1px"
          borderColor="gray.200"
        >
          <Box p={2}>{JSON.stringify(state.request1?.status, null, 2)}</Box>
          <Box p={2}>{JSON.stringify(state.request1?.isLoading, null, 2)}</Box>
          <Box p={2}>
            {JSON.stringify(state.request1?.response?.data, null, 2)}
          </Box>
          <Box p={2}>
            {JSON.stringify(
              {
                data: state.request1?.error?.response?.data,
                message: state.request1?.error?.message,
              },
              null,
              2
            )}
          </Box>
        </Grid>
      )}
      {state.request2 && (
        <Grid
          gap={4}
          gridTemplateColumns="1fr 1fr 1fr 3fr 3fr"
          borderBottomWidth="1px"
          borderColor="gray.200"
        >
          <Box p={2}>{JSON.stringify(state.request2?.status, null, 2)}</Box>
          <Box p={2}>{JSON.stringify(state.request2?.isLoading, null, 2)}</Box>
          <Box p={2}>
            {JSON.stringify(state.request2?.response?.data, null, 2)}
          </Box>
          <Box p={2}>
            {JSON.stringify(
              {
                data: state.request2?.error?.response?.data,
                message: state.request2?.error?.message,
              },
              null,
              2
            )}
          </Box>
        </Grid>
      )}
      {state.request3 && (
        <Grid
          gap={4}
          gridTemplateColumns="1fr 1fr 1fr 3fr 3fr"
          borderBottomWidth="1px"
          borderColor="gray.200"
        >
          <Box p={2}>{JSON.stringify(state.request3?.status, null, 2)}</Box>
          <Box p={2}>{JSON.stringify(state.request3?.isLoading, null, 2)}</Box>
          <Box p={2}>
            {JSON.stringify(state.request3?.response?.data, null, 2)}
          </Box>
          <Box p={2}>
            {JSON.stringify(
              {
                data: state.request3?.error?.response?.data,
                message: state.request3?.error?.message,
              },
              null,
              2
            )}
          </Box>
        </Grid>
      )}
      {state.request4 && (
        <Grid
          gap={4}
          gridTemplateColumns="1fr 1fr 1fr 3fr 3fr"
          borderBottomWidth="1px"
          borderColor="gray.200"
        >
          <Box p={2}>{JSON.stringify(state.request4?.status, null, 2)}</Box>
          <Box p={2}>{JSON.stringify(state.request4?.isLoading, null, 2)}</Box>
          <Box p={2}>
            {JSON.stringify(state.request4?.response?.data, null, 2)}
          </Box>
          <Box p={2}>
            {JSON.stringify(
              {
                data: state.request4?.error?.response?.data,
                message: state.request4?.error?.message,
              },
              null,
              2
            )}
          </Box>
        </Grid>
      )}
      {state.request5 && (
        <Grid
          gap={4}
          gridTemplateColumns="1fr 1fr 1fr 3fr 3fr"
          borderBottomWidth="1px"
          borderColor="gray.200"
        >
          <Box p={2}>{JSON.stringify(state.request5?.status, null, 2)}</Box>
          <Box p={2}>{JSON.stringify(state.request5?.isLoading, null, 2)}</Box>
          <Box p={2}>
            {JSON.stringify(state.request5?.response?.data, null, 2)}
          </Box>
          <Box p={2}>
            {JSON.stringify(
              {
                data: state.request5?.error?.response?.data,
                message: state.request5?.error?.message,
              },
              null,
              2
            )}
          </Box>
        </Grid>
      )}
      <Button style={{ margin: 10 }} onClick={updateConfigs}>
        set configs
      </Button> */}
      <Button style={{ margin: 10 }} onClick={() => get()}>
        fetch requests
      </Button>
    </div>
  );
}

export default App;
