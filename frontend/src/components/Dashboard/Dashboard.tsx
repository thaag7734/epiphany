import { type MouseEvent, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import type { Note } from "../../types/Models";
import NoteCard from "./NoteCard";
import "./Dashboard.css";
import NoteModal from "../NoteModal/NoteModal";
import { type ModalContextType, useModal } from "../Modal/Modal";
import NewCardButton from "../NewCardCard/NewCardButton";
import {
  getBoardNotes,
  notesSlice,
  selectAllNotes,
} from "../../redux/reducers/notes";
import {
  getBoards,
  selectBoardById,
  updateBoard,
} from "../../redux/reducers/boards";
import { getBoardLabels, labelsSlice } from "../../redux/reducers/labels";
import { teamSlice } from "../../redux/reducers/teams";
import { useParams } from "react-router";

function Dashboard() {
  const { boardId } = useParams();

  const board = useAppSelector((state) =>
    boardId ? selectBoardById(state, Number(boardId)) : null,
  );
  const notes = useAppSelector((state) => selectAllNotes(state));
  const user = useAppSelector((state) => state.session.user);

  const [boardName, setBoardName] = useState<string>("");

  const dispatch = useAppDispatch();

  const dashHome = useRef<HTMLDivElement | null>(null);

  const { setModalContent } = useModal() as ModalContextType;

  useEffect(() => {
    dispatch(notesSlice.actions.clearState());
    dispatch(labelsSlice.actions.clearState());
  }, [dispatch]);

  useEffect(() => {
    if (!boardId) return;

    if (!board) {
      dispatch(getBoards()).then(() => {
        dispatch(getBoardNotes(Number(boardId)));
        dispatch(getBoardLabels(Number(boardId)));
      });
    } else {
      dispatch(getBoardNotes(Number(boardId)));
      dispatch(getBoardLabels(Number(boardId)));
    }
  }, [dispatch, boardId]);

  useEffect(() => {
    if (board?.team) {
      dispatch(teamSlice.actions.setTeam(board.team));
    } else {
      dispatch(teamSlice.actions.clearState());
    }
  }, [board, dispatch]);

  useEffect(() => {
    const nav = document.querySelector(".top-nav") as HTMLElement;

    if (!nav || !dashHome.current) return;

    const navHeight = nav.offsetHeight;
    const vh = Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0,
    );

    dashHome.current.style.height = `${(vh - navHeight).toString()}px`;
  }, []);

  useEffect(() => {
    if (!board?.name) return;
    setBoardName(board.name);
  }, [board]);

  const handleNewNoteClick = (e: MouseEvent) => {
    e.stopPropagation();

    setModalContent(<NoteModal boardId={board!.id} />);
  };

  const handleUpdateBoardName = async () => {
    dispatch(
      updateBoard({
        id: Number(boardId),
        name: boardName,
      }),
    ); //TODO error handling
  };

  return (
    <div className="dash-home" ref={dashHome}>
      {notes.map((note: Note) => (
        <NoteCard noteId={note.id} key={note.id} />
      ))}

      <NewCardButton onClick={handleNewNoteClick} />
      {board &&
        (board.owner_id === user?.id ? (
          <input
            className="board-name"
            type="text"
            value={boardName}
            onChange={(e) => setBoardName(e.currentTarget.value)}
            onBlur={handleUpdateBoardName}
          />
        ) : (
          <h1 className="board-name">{board.name}</h1>
        ))}
    </div>
  );
}

export default Dashboard;
