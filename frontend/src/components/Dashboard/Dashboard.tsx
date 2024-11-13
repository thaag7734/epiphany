import { type MouseEvent, useEffect } from "react";
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
  const notes = useAppSelector((state) => Object.values(state.notes));

  const { setModalContent } = useModal() as ModalContextType;

  useEffect(() => { }, [notes]);

  const handleNewNoteClick = (e: MouseEvent) => {
    e.stopPropagation();

    setModalContent(<NoteModal />);
  };

  return (
    <div className="dash-home">
      {notes.map((note: Note) => (
        <NoteCard noteId={note.id} key={note.id} />
      ))}

      {/* TODO move styles into css file and add cursor: pointer on hover */}
      <div
        style={{ width: "35%", aspectRatio: "1 / 1", fontSize: "80px" }}
        onClick={handleNewNoteClick}
      >
        <BsFillPlusSquareFill />
      </div>

      {board && <div className="board-name">{board.name}</div>}
    </div>
  );
}

export default Dashboard;
