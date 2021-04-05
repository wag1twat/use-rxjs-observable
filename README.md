# Running request with RxJs

```javascript
import React, { useEffect, useState } from "react";
import { useRequest } from "use-rxjs-requests";
import { Config } from "./useRequest/types";

type Post = {
  body: string,
  id: number,
  title: string,
  userId: number,
};

function App() {
  const { state, fetch } =
    useRequest <
    Post >
    ({
      requestId: "post 1",
      method: "GET",
      url: "https://jsonplaceholder.typicode.com/posts/1",
    },
    {
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
```
