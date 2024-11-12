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
   Navigate,
   Outlet,
   RouterProvider,
   useLocation,
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
import { Board, User } from "./types/Models";

function App() {
   const dispatch = useAppDispatch();
   const [isLoaded, setIsLoaded] = useState(false);

   const currentBoardId: number | undefined = useAppSelector(
      (state) => state.session.currentBoardId
   );

   useEffect(() => {
      dispatch(restoreUser()).then(() => {
         setIsLoaded(true);
      });
   }, [dispatch]);

   if (import.meta.env.MODE !== "production") {
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
      window.getCookie = getCookie;
   }

   function Layout() {
      const navigate = useNavigate();
      const location = useLocation();

      const boards: BoardsState = useAppSelector((state) => state.boards);
      const user: User | null = useAppSelector((state) => state.session.user);

      useEffect(() => {
         if (currentBoardId === undefined) return;

         dispatch(notesSlice.actions.clearState());
         dispatch(labelsSlice.actions.clearState());

         dispatch(getBoardNotes(currentBoardId));
         dispatch(getBoardLabels(currentBoardId));

         const currentBoard: Board = boards[currentBoardId];

         if (currentBoard?.team) {
            dispatch(teamSlice.actions.setTeam(currentBoard.team));
         } else {
            dispatch(teamSlice.actions.clearState());
            navigate(`boards/${currentBoardId}`);
         }
      }, [currentBoardId, dispatch]);

      useEffect(() => {
         if (!isLoaded) return;
         if (user) {
            dispatch(getBoards()).then(() => {
               dispatch(sessionSlice.actions.changeBoard(user.root_board_id!));
            });
         }
      }, [isLoaded]);
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
            //{
            //  element: <Boards />,
            //  path: "boards",
            //},
            {
               element: (
                  <>
                     <SidePanel />
                     <div>
                        <TopNav boardId={currentBoardId} />
                        <Dashboard boardId={currentBoardId} />
                     </div>
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
