import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import type { User, Label, Note, Board } from "../../types/Models";
// import { Link, useNavigate } from "react-router-dom";
import { BiSolidCalendarExclamation } from "react-icons/bi";
import { sessionSlice } from "../../redux/reducers/session";


function Dashboard({ boardId }: { boardId: number | undefined }) {
  const dispatch = useAppDispatch();
  // const navigate = useNavigate();

  const board = useAppSelector((state) => Object.values(state.boards).find((b) => b.id === boardId));
  const labels = useAppSelector((state) => Object.values(state.labels));
  const user = useAppSelector((state) => state.session.user);

  const handleNoteClick = () => {
    //* Open delete/edit modal 
    //*     - Import modal, set onClick to open
    // Link
  }

  useEffect(() => {
    if (user) {
      dispatch(sessionSlice.actions.changeBoard(user.root_board_id!));
    }
  })

  // index for priority icon color
  const priorityColors = ["grey", "green", "yellow", "red"];

  return (
    <div className="dash-home">
      {board?.notes.map((note: Note) => (
        <div
          key={note.id}
          className="note-tile"
          onClick={() => handleNoteClick()}
          title={note.title} //^ (optional tooltip val)
        >
          <div className="note-title">{note.title}</div>

          <div className="note-content">{note.content}</div>

          <div className="note-priority-icon">
            <BiSolidCalendarExclamation
              style={{ color: priorityColors[note.priority] }}
            />
          </div>

          <ul className="note-labels-list">
            {labels?.map((label) => (
              <li
                key={label.id}
                className="note-label-pill"
              >
                {label.name}
              </li>
            ))}
          </ul>

        </div>
      ))}

      <div className="board-name">{board?.name}</div>
    </div>
  )
}

export default Dashboard;
