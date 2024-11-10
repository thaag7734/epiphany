import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { login } from "./redux/reducers/session";
import { createLabel } from "./redux/reducers/labels";

function App() {
  const [count, setCount] = useState(0);
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state);

  useEffect(() => {
    console.log(state);
  }, [state]);

  useEffect(() => {
    window.dispatch = dispatch;
    window.actions = { createLabel };
    dispatch(
      login({
        csrf_token:
          "IjAwNmRlODQ5NmQ3M2RkZWI0MTA2YWM5MmYwY2EwMjIwNmU5NWJmY2Ei.ZzAhsg.UzL1KJOav36D43rzIU8owscRf5Q",
        email: "demo@aa.io",
        password: "password",
      }),
    );
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
