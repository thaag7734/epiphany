import type { ChangeEvent, FC, FormEvent, ReactElement } from "react";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import type { Note } from "../../types/Models";
import ErrorMessage from "../ErrorMessage";
import { createNote, deleteNote, updateNote } from "../../redux/reducers/notes";
import { getCsrf } from "../../util/cookies";
import { type ModalContextType, useModal } from "../Modal/Modal";
import { RiSaveFill } from "react-icons/ri";
import { FaTrash } from "react-icons/fa";
import "./NoteModal.css"

function NoteModal({ noteId }: { noteId?: number }): ReturnType<FC> {
  const boardId = useAppSelector((state) => state.session.currentBoardId);

  const note: Note | null = noteId
    ? useAppSelector((state) => state.notes[noteId])
    : null;
  const { closeModal } = useModal() as ModalContextType;

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [priority, setPriority] = useState<number>(0);
  //const [deadline, setDeadline] = useState<Date>(new Date());

  const [errors, setErrors] = useState<{ [key: string]: ReactElement }>({});
  const dispatch = useAppDispatch();

  const error = (msg: string): ReactElement => {
    return <ErrorMessage msg={msg} />;
  };

  const validate = () => {
    const errors: { [key: string]: ReactElement } = {};

    if (!title || title.length > 32)
      errors.title = error("Title must be between 1 and 32 characters");
    if (content.length > 2000)
      errors.title = error("Content must be less than 2000 characters long");
    if (priority < 0 || priority > 3)
      errors.priority = error(
        "Priority must be either None, Low, Medium, or High",
      );

    setErrors(errors);
    return Object.entries(errors).length === 0;
  };

  useEffect(() => {
    if (!note) return;

    setTitle(note.title);
    setContent(note.content);
    setPriority(note.priority);
  }, []);

  useEffect(() => { }, [errors]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const promise = note
      ? dispatch(
        updateNote({
          csrf_token: await getCsrf(),
          board_id: Number(boardId),
          title,
          content,
          priority,
          id: noteId,
        }),
      )
      : dispatch(
        createNote({
          csrf_token: await getCsrf(),
          board_id: Number(boardId),
          title,
          content,
          priority,
        }),
      );

    promise.then(({ payload, type }) => {
      if (
        ["notes/createNote/rejected", "notes/updateNote/rejected"].includes(
          type,
        )
      ) {
        const errors: { [key: string]: ReactElement } = {};

        for (const err of Object.keys(payload.errors)) {
          errors[err] = error(payload.errors[err]);
        }

        setErrors(errors);
      } else {
        closeModal();
      }
    });
  };

  const handleDelete = () => {
    const timeout = setTimeout(() => {
      dispatch(deleteNote(noteId!)).then(() => closeModal());
      // TODO error handling if deletion fails
    }, 3000);

    addEventListener(
      "mouseup",
      () => {
        clearTimeout(timeout);
      },
      { once: true },
    );
  };

  const handlePriorityChange = (e: ChangeEvent) => {
    setPriority(Number.parseInt((e.target as HTMLInputElement).value));
  };

  return (
    <div className="note-modal">
      <form onSubmit={handleSave}>
        <input
          type="text"
          name="title"
          placeholder="Add a title"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />
        {errors.title}
        <textarea
          name="content"
          placeholder="Write some stuff"
          value={content}
          onChange={(e) => setContent(e.currentTarget.value)}
        />
        {errors.content}
        <div className="priority-btns">
          <p>Priority:</p>
          {errors.priority}
          <label>
            None
            <input
              type="radio"
              name="priority"
              value={0}
              checked={priority === 0}
              onChange={handlePriorityChange}
            />
          </label>
          <label>
            Low
            <input
              type="radio"
              name="priority"
              value={1}
              checked={priority === 1}
              onChange={handlePriorityChange}
            />
          </label>
          <label>
            Medium
            <input
              type="radio"
              name="priority"
              value={2}
              checked={priority === 2}
              onChange={handlePriorityChange}
            />
          </label>
          <label>
            High
            <input
              type="radio"
              name="priority"
              value={3}
              checked={priority === 3}
              onChange={handlePriorityChange}
            />
          </label>
        </div>
        <button type="submit">
          <RiSaveFill />
        </button>
        {noteId && (
          <div
            className="delete-btn"
            onMouseDown={handleDelete}
            title="Hold 3s to delete"
          >
            <FaTrash />
          </div>
        )}
      </form>
    </div>
  );
}

export default NoteModal;
