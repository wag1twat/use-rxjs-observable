import React, { useEffect, useState } from "react";
import { useRequest } from "./useRequest";
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
    }, 5000);
  }, []);

  const { state, fetch } = useRequest<Post>(config);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    console.log("state", state);
  }, [state]);
  return <div></div>;
}

export default App;
