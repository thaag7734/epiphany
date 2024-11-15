import React, { type MouseEvent, useEffect } from "react";
import { /* useAppDispatch ,*/ useAppSelector } from "../../redux/hooks";
import { BiSolidCalendarExclamation } from "react-icons/bi";
import "./NoteCard.css";
import { type ModalContextType, useModal } from "../Modal/Modal";
import NoteModal from "../NoteModal/NoteModal";
import { selectNoteById } from "../../redux/reducers/notes";
import { selectLabelsByBoardId } from "../../redux/reducers/labels";

export default function NoteCard({ noteId }: { noteId: number }) {
  // const dispatch = useAppDispatch();

  const note = useAppSelector((state) => selectNoteById(state, noteId));
  const labels = useAppSelector((state) =>
    note ? selectLabelsByBoardId(state, note.board_id) : null,
  );

  const { setModalContent } = useModal() as ModalContextType;

  useEffect(() => { }, [note]);

  const handleNoteClick = (e: MouseEvent) => {
    e.stopPropagation();

    setModalContent(<NoteModal noteId={noteId} />);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();

    //* detect drop, do something. highlight card.
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    //* "grab" label data to pass to thunk?

    // dispatch(thunkityThunkThunk())
  };

  // index for priority icon color
  const priorityColors = ["grey", "green", "yellow", "red"];

  return (
    <>
      {note ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          key={note.id}
          className="note-tile"
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
