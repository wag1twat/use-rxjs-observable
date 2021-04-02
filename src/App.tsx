import React, { useEffect, useState } from "react";
import { useRequest } from "./useRequest";
// import { useRequest } from "use-rxjs-requests";
import { Config } from "./useRequest/types";

type Post = {
  body: string;
  id: number;
  title: string;
  userId: number;
};

function App() {
  const [config, setConfig] = useState<Config>({
    requestId: "post 1",
    method: "GET",
    url: "https://jsonplaceholder.typicode.com/posts/1",
  });

  useEffect(() => {
    setInterval(() => {
      setConfig({
        requestId: "post 1",
        method: "GET",
        url: "https://jsonplaceholder.typicode.com/posts/1",
      });

      setTimeout(() => {
        setConfig({
          requestId: "post 1 error",
          method: "GET",
          url: "https://jsonplaceholder.typicode.com/posts/1/x",
        });
      }, 4000);
    }, 8000);
  }, []);

  const { state, fetch } = useRequest<Post>(config, {
    onSuccess: (result) => {
      console.log("onSuccess", result);
    },
    onError: (result) => {
      console.log("onError", result);
    },
  });

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    console.log("state", state);
  }, [state]);
  return <div></div>;
}

export default App;
