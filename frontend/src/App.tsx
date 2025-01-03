import { useEffect, useState } from "react";
import "./App.css";
import TopNav from "./components/top_nav";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { login, logout, restoreUser, signup } from "./redux/reducers/session";
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
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import {
  createTeam,
  deleteTeam,
  teamSlice,
  updateTeam,
} from "./redux/reducers/teams";
import SidePanel from "./components/SidePanel";
import { getCookie } from "./util/cookies";
import LoginSignup from "./components/LoginSignup";
import Dashboard from "./components/Dashboard/Dashboard";
import type { User } from "./types/Models";
import BoardsPage from "./components/BoardsPage/BoardsPage";

function App() {
  const dispatch = useAppDispatch();

  if (import.meta.env.MODE !== "production") {
    (window as any).dispatch = dispatch;
    (window as any).actions = {
      session: {
        login,
        logout,
        signup,
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
    (window as any).getCookie = getCookie;
  }

  function Layout() {
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();

    const user: User | null = useAppSelector((state) => state.session.user);

    useEffect(() => {
      if (isLoaded && !user) navigate("/");
    }, [user, isLoaded, navigate]);

    useEffect(() => {
      dispatch(restoreUser()).then(() => {
        setIsLoaded(true);
      });
    }, []);

    return isLoaded ? <Outlet /> : null;
  }

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
          element: <LoginSignup />,
        },
        {
          element: (
            <>
              <TopNav />
              <BoardsPage />
            </>
          ),
          path: "boards",
        },
        {
          element: (
            <>
              <SidePanel />
              <TopNav />
              <Dashboard />
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
