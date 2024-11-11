import { useEffect, useState } from "react";
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
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import {
  createTeam,
  deleteTeam,
  teamSlice,
  updateTeam,
} from "./redux/reducers/teams";

function App() {
  const dispatch = useAppDispatch();
  const currentBoardId: number | undefined = useAppSelector(
    (state) => state.session.currentBoardId,
  );

  if (import.meta.env.MODE !== "production") {
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
        team: {
          createTeam,
          updateTeam,
          deleteTeam,
          clearState: teamSlice.actions.clearState,
        },
      };
    }, [dispatch]);
  }

  useEffect(() => {
    if (currentBoardId === undefined) return;

    dispatch(notesSlice.actions.clearState());
    dispatch(labelsSlice.actions.clearState());

    dispatch(getBoardNotes(currentBoardId));
    dispatch(getBoardLabels(currentBoardId));
  }, [currentBoardId, dispatch]);

  function Layout() {
    return <Outlet />;
  }

  const router = createBrowserRouter([
    {
      element: (
        <>
          <Layout />
          <LoginSignupModal />
        </>
      ),
      path: "/",
      children: [
        {
          index: true,
          element: (
            <>
              <TopNav board={1} />
              <SideBar board={1} />
              <Dashboard board={1} />
            </>
          ),
        },
        {
          element: <Boards />,
          path: "boards",
        },
        {
          element: (
            <>
              <TopNav board={currentBoardId} />
              <SideBar board={currentBoardId} />
              <Dashboard board={currentBoardId} />
            </>
          ),
          path: "boards/:boardId",
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
