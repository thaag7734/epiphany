import { type MouseEvent, useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import type { Note } from "../../types/Models";
import NoteCard from "./NoteCard";
import "./Dashboard.css";
import { BsFillPlusSquareFill } from "react-icons/bs";
import NoteModal from "../NoteModal/NoteModal";
import { type ModalContextType, useModal } from "../Modal/Modal";

function Dashboard({ boardId }: { boardId: number | undefined }) {
  const board = useAppSelector((state) =>
    Object.values(state.boards).find((b) => b.id === boardId),
  );
  const dashHome = useRef<HTMLDivElement | null>(null);

  const [boardName, setBoardName] = useState("");

  const notes = useAppSelector((state) => Object.values(state.notes));

  const { setModalContent } = useModal() as ModalContextType;

  useEffect(() => {}, [notes]);

  useEffect(() => {
      const nav = document.querySelector(".top-nav") as HTMLElement;

      if (!nav || !dashHome.current) return

      const navHeight = nav.offsetHeight;
      const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
      
      dashHome.current.style.height = (vh - navHeight).toString() + "px";
  }, []);

  useEffect(() => {
    if (!board?.name) return
    setBoardName(board.name);
  }, [board])

  const handleNewNoteClick = (e: MouseEvent) => {
    e.stopPropagation();

    setModalContent(<NoteModal />);
  };

  return (
    <div 
      className="dash-home"
      ref={dashHome}      
      >
      {notes.map((note: Note) => (
        <NoteCard noteId={note.id} key={note.id} />
      ))}

        <BsFillPlusSquareFill 
          className="new-note-button"
          onClick={handleNewNoteClick}
        />

      {board && <input className="board-name" type="text" value={board.name} onChange={(e) => setBoardName(e.currentTarget.value)}></input>}
    </div>
  );
}

export default Dashboard;
