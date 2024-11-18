import type React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { BiSolidCalendarExclamation } from "react-icons/bi";
import "./NoteCard.css";
import { type ModalContextType, useModal } from "../Modal/Modal";
import NoteModal from "../NoteModal/NoteModal";
import {
  addLabelToNote,
  removeLabelFromNote,
  selectNoteById,
} from "../../redux/reducers/notes";
import { selectLabelsByBoardId } from "../../redux/reducers/labels";
import type { NoteLabelFormData } from "../../types/FormData";

export default function NoteCard({ noteId }: { noteId: number }) {
  const dispatch = useAppDispatch();

  const note = useAppSelector((state) => selectNoteById(state, noteId));
  const labels = useAppSelector((state) =>
    note ? selectLabelsByBoardId(state, note.board_id) : null,
  );

  const { setModalContent } = useModal() as ModalContextType;

  const handleNoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    setModalContent(<NoteModal boardId={note!.board_id} noteId={noteId} />);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    //* "grab" label data to pass to thunk?
    const payload: NoteLabelFormData = {
      noteId,
      labelId: Number(e.dataTransfer.getData("text")),
    };
    //TODO Error handling for dispatch errors
    dispatch(addLabelToNote(payload));
  };

  const handleDragEnter = (e: React.DragEvent) => {
    (e.currentTarget as HTMLDivElement).style.boxShadow = "3px 3px 5px purple";
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();
    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
  };

  const removeLabel = (e: React.MouseEvent, labelId: number) => {
    e.stopPropagation();

    dispatch(
      removeLabelFromNote({
        noteId,
        labelId,
      }),
    );
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

          <p className="note-content">{note.content}</p>

          <div className="note-priority-icon">
            <BiSolidCalendarExclamation
              style={{ color: priorityColors[note.priority] }}
            />
          </div>

          <ul className="note-labels-list">
            {labels
              ?.filter((l) => note.labels.includes(l.id))
              .map((label) => (
                <li
                  key={label.id}
                  onClick={(e) => removeLabel(e, label.id)}
                  className="note-label-pill"
                >
                  {label.name}
                </li>
              ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}
