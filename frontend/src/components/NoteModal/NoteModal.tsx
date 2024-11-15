import type { ChangeEvent, FC, FormEvent, ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import ErrorMessage from "../ErrorMessage";
import { createNote, deleteNote, updateNote } from "../../redux/reducers/notes";
import { getCsrf } from "../../util/cookies";
import { type ModalContextType, useModal } from "../Modal/Modal";
import { RiSaveFill } from "react-icons/ri";
import { FaTrash } from "react-icons/fa";
import "./NoteModal.css";

function NoteModal({ noteId }: { noteId?: number }): ReturnType<FC> {
  const boardId = useAppSelector((state) => state.session.currentBoardId);

  const note = noteId ? useAppSelector((state) => state.notes[noteId]) : null;

  const { closeModal } = useModal() as ModalContextType;
  const deleteBtn = useRef<HTMLDivElement | null>(null);

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [priority, setPriority] = useState<number>(0);
  //const [deadline, setDeadline] = useState<Date>(new Date());

  const [awaitingDelConf, setAwaitingDelConf] = useState<boolean>(false);
  const [deleteBtnContent, setDeleteBtnContent] = useState<
    ReactElement | string
  >(<FaTrash />);

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
    if (!noteId || !deleteBtn.current) return;

    //const timeout = setTimeout(() => {
    //  dispatch(deleteNote(noteId)).then(() => closeModal());
    //}, 3000);
    //addEventListener(
    //  "mouseup",
    //  () => {
    //    clearTimeout(timeout);
    //  },
    //  { once: true },
    //);

    if (!awaitingDelConf) {
      deleteBtn.current.addEventListener(
        "mouseleave",
        () => {
          setDeleteBtnContent(<FaTrash />);
          setAwaitingDelConf(false);
        },
        { once: true },
      );

      setAwaitingDelConf(true);

      setDeleteBtnContent("Really delete this note?");
    } else {
      setAwaitingDelConf(false);

      dispatch(deleteNote(noteId)).then(({ payload, type }) => {
        if (type === "notes/deleteNote/rejected") {
          setErrors({ message: payload.message });
        } else {
          closeModal();
        }
      });
    }
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
            ref={deleteBtn}
          >
            {deleteBtnContent}
          </div>
        )}
      </form>
    </div>
  );
}

export default NoteModal;
