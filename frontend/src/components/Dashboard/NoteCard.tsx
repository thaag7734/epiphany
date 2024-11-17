import React, { useEffect } from "react";
import {
	/* useAppDispatch ,*/ useAppDispatch,
  useAppSelector,
} from "../../redux/hooks";
import { BiSolidCalendarExclamation } from "react-icons/bi";
import "./NoteCard.css";
import { type ModalContextType, useModal } from "../Modal/Modal";
import NoteModal from "../NoteModal/NoteModal";
import { addLabelToNote, selectNoteById } from "../../redux/reducers/notes";
import { selectLabelsByBoardId } from "../../redux/reducers/labels";

export default function NoteCard({ noteId }: { noteId: number }) {
  const note = useAppSelector((state) => selectNoteById(state, noteId));
  const labels = useAppSelector((state) =>
    note ? selectLabelsByBoardId(state, note.board_id) : null,
  );

  const { setModalContent } = useModal() as ModalContextType;
  const dispatch = useAppDispatch();

  useEffect(() => { }, [note]);

  const handleNoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    setModalContent(<NoteModal noteId={noteId} />);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();

    //* detect drop, do something. highlight card.
  };

  const handleDrop = (e: React.DragEvent) => {
    dispatch(
      addLabelToNote({
        note_id: noteId,
        label_id: Number(e.dataTransfer.getData("text/plain")),
      }),
    );
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.stopPropagation();
    (e.currentTarget as HTMLDivElement).style.boxShadow = "3px 3px 5px purple";
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();
    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
  };

  // index for priority icon color
  const priorityColors = ["grey", "green", "yellow", "red"];

  return (
    <>
      {note ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          key={note.id}
          className="note-tile"
          data-id={noteId}
          onClick={handleNoteClick}
          title={note.title}
        >
          <div className="note-title">{note.title}</div>

          <div className="note-content">{note.content}</div>

          <div className="note-priority-icon">
            <BiSolidCalendarExclamation
              style={{ color: priorityColors[note.priority] }}
            />
          </div>

          <ul className="note-labels-list">
            {labels
              ?.filter((l) => note.labels.includes(l.id))
              .map((label) => (
                <li key={label.id} className="note-label-pill">
                  {label.name}
                </li>
              ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}
