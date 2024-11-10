import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { login, logout, sessionSlice, signup } from "./redux/reducers/session";
import {
  createLabel,
  deleteLabel,
  getBoardLabels,
  labelsSlice,
  updateLabel,
} from "./redux/reducers/labels";
import {
  createNote,
  deleteNote,
  getBoardNotes,
  notesSlice,
  updateNote,
} from "./redux/reducers/notes";
import {
  boardsSlice,
  createBoard,
  deleteBoard,
  getBoards,
  updateBoard,
} from "./redux/reducers/boards";

function App() {
  const [count, setCount] = useState(0);
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state);
  const currentBoardId: number | undefined = useAppSelector(
    (state) => state.session.currentBoardId,
  );

  useEffect(() => {
    console.log(state);
  }, [state]);

  useEffect(() => {
    window.dispatch = dispatch;
    window.actions = {
      session: {
        login,
        logout,
        signup,
        changeBoard: sessionSlice.actions.changeBoard,
      },
      notes: {
        getBoardNotes,
        createNote,
        updateNote,
        deleteNote,
        clearState: notesSlice.actions.clearState,
      },
      labels: {
        getBoardLabels,
        createLabel,
        updateLabel,
        deleteLabel,
        clearState: labelsSlice.actions.clearState,
      },
      boards: {
        getBoards,
        createBoard,
        updateBoard,
        deleteBoard,
        clearState: boardsSlice.actions.clearState,
      },
    };
  }, [dispatch]);

  useEffect(() => {
    if (currentBoardId === undefined) return;

    dispatch(notesSlice.actions.clearState());
    dispatch(labelsSlice.actions.clearState());

    dispatch(getBoardNotes(currentBoardId));
    dispatch(getBoardLabels(currentBoardId));
  }, [currentBoardId, dispatch]);

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
