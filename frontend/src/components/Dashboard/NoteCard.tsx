import { useEffect } from "react";
import { useAppSelector } from "../../redux/hooks";
import { BiSolidCalendarExclamation } from "react-icons/bi";
import { ImOpt } from "react-icons/im";
import "./NoteCard.css";



export default function NoteCard({ noteId }: {noteId: number}) {
    const note = useAppSelector((state) => Object.values(state.notes).find((n) => n.id === noteId));
    const labels = useAppSelector((state) => Object.values(state.labels));

    useEffect(() => {}, [note])


    const handleNoteClick = () => {
        //* Open delete/edit modal 
        //*     - Import modal, set onClick to open
        // Link
    }

     // index for priority icon color
     const priorityColors = ["grey", "green", "yellow", "red"];



    return (
        <>
        { note ? (<div
            key={note.id}
            className="note-tile"
            onClick={() => handleNoteClick()}
            title={note.title} //^ (optional tooltip val)
            >
                <div className="note-title">{note.title}</div>

                <div className="note-content">{note.content}</div>

                    <div className="note-priority-icon">
                    <BiSolidCalendarExclamation 
                    style={{ color: priorityColors[note.priority]}}
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
        ) : null}
        </>
    )
}