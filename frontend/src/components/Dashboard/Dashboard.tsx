import { type MouseEvent, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import type { Note } from "../../types/Models";
import NoteCard from "./NoteCard";
import "./Dashboard.css";
import NoteModal from "../NoteModal/NoteModal";
import { type ModalContextType, useModal } from "../Modal/Modal";
import NewCardButton from "../NewCardCard/NewCardButton";
import { selectAllNotes } from "../../redux/reducers/notes";
import { selectBoardById, updateBoard } from "../../redux/reducers/boards";

function Dashboard({ boardId }: { boardId: number | undefined }) {
  const board = useAppSelector((state) =>
    boardId ? selectBoardById(state, boardId) : null,
  );
  const notes = useAppSelector((state) => selectAllNotes(state));

  const [boardName, setBoardName] = useState<string>("");

  const dispatch = useAppDispatch();

  const dashHome = useRef<HTMLDivElement | null>(null);

  const { setModalContent } = useModal() as ModalContextType;

  useEffect(() => { }, [notes]);

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

    setModalContent(<NoteModal />);
  };

  const handleUpdateBoardName = async () => {
    dispatch(
      updateBoard({
        id: boardId,
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

      {board && (
        <input
          className="board-name"
          type="text"
          value={boardName}
          onChange={(e) => setBoardName(e.currentTarget.value)}
          onBlur={handleUpdateBoardName}
        />
      )}
    </div>
  );
}

export default Dashboard;
