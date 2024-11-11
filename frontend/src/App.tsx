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
  type BoardsState,
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
import { Board } from "./types/Models";
import { current } from "@reduxjs/toolkit";

function App() {
  const dispatch = useAppDispatch();
  const currentBoardId: number | undefined = useAppSelector(
    (state) => state.session.currentBoardId,
  );
  const boards: BoardsState = useAppSelector((state) => state.boards);

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
          setTeam: teamSlice.actions.setTeam,
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

    const currentBoard: Board = boards[currentBoardId];

    if (currentBoard.team) {
      dispatch(teamSlice.actions.setTeam(currentBoard.team));
    } else {
      dispatch(teamSlice.actions.clearState());
    }
  }, [currentBoardId]);

  function Layout() {
    return (
      // <Outlet />
      <h1>router implemented</h1>
    );
  }

  /*
  const router = createBrowserRouter([
    {
      element: (
        <>
          <Layout />
        </>
      ),
      path: "/",
      children: [
        {
          index: true,
          element: (
            <LoginSignupModal />
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

  return <RouterProvider router={router} />;*/
}

export default App;
