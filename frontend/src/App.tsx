import { useEffect, useState } from "react";
import "./App.css";
import TopNav from "./components/top_nav";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import {
  login,
  logout,
  restoreUser,
  sessionSlice,
  signup,
} from "./redux/reducers/session";
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
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useNavigate,
  useParams,
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
import type { Board, User } from "./types/Models";
import BoardsPage from "./components/BoardsPage/BoardsPage";

function App() {
  const dispatch = useAppDispatch();

  const currentBoardId: number | undefined = useAppSelector(
    (state) => state.session.currentBoardId,
  );

  if (import.meta.env.MODE !== "production") {
    (window as any).dispatch = dispatch;
    (window as any).actions = {
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
    (window as any).getCookie = getCookie;
  }

  function Layout() {
    const { boardId } = useParams();
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();

    const boards: BoardsState = useAppSelector((state) => state.boards);
    const user: User | null = useAppSelector((state) => state.session.user);

    useEffect(() => {
      if (isLoaded && !user) navigate("/");
    }, [user, isLoaded, navigate]);

    useEffect(() => {
      dispatch(restoreUser()).then(() => {
        setIsLoaded(true);
      });
    }, []);

    useEffect(() => {
      if (!user || currentBoardId === undefined) return;

      dispatch(notesSlice.actions.clearState());
      //dispatch(labelsSlice.actions.clearState());

      dispatch(getBoardNotes(currentBoardId));
      dispatch(getBoardLabels(currentBoardId));

      const currentBoard: Board = boards[currentBoardId];

      if (currentBoard?.team) {
        dispatch(teamSlice.actions.setTeam(currentBoard.team));
      } else {
        dispatch(teamSlice.actions.clearState());
        // navigate(`boards/${currentBoardId}`);
      }
    }, [currentBoardId]);

    useEffect(() => {
      if (!isLoaded) return;
      if (user) {
        dispatch(getBoards()).then(() => {
          if (boardId) {
            dispatch(sessionSlice.actions.changeBoard(Number(boardId)));
          } else {
            dispatch(sessionSlice.actions.changeBoard(user.root_board_id!));
          }
        });
      }
    }, [isLoaded, boardId]);
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
              <Dashboard boardId={currentBoardId} />
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
