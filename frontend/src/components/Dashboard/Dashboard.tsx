import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import type { User, Label, Note, Board } from "../../types/Models"; 
// import { Link, useNavigate } from "react-router-dom";
import { BiSolidCalendarExclamation } from "react-icons/bi";
import NoteCard from "./NoteCard";
import "./Dashboard.css";


function Dashboard({ boardId }: {boardId: number}) {
    // const dispatch = useAppDispatch();
    // const navigate = useNavigate();

    const board = useAppSelector((state) => Object.values(state.boards).find((b) => b.id === boardId));
    const labels = useAppSelector((state) => Object.values(state.labels));
    const notes = useAppSelector((state) => Object.values(state.notes));

    useEffect(() => {}, [notes])

    // const handleNoteClick = () => {
    //     //* Open delete/edit modal 
    //     //*     - Import modal, set onClick to open
    //     // Link
    // }

    // index for priority icon color
    // const priorityColors = ["grey", "green", "yellow", "red"];

    return (
        <div className="dash-home">
            {notes.map((note: Note) => (
                <NoteCard noteId={note.id}/>
            ))}

            {/* <div className="board-name">{board?.name}</div> */}
            {board && <div className="board-name">{board.name}</div>}
        </div>
    )
}

export default Dashboard;