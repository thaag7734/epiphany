import { useEffect } from "react";
import { useAppSelector } from "../../redux/hooks";
import type { User, Label, Note, Board } from "../../types/Models";
import BoardCard from "./BoardCard";
import "./BoardPage.css";
import { DiVim } from "react-icons/di";


export default function BoardsPage({ board_id }: {board_id: number}) {
    const personalBoards = useAppSelector((state) => Object.values(state.boards).filter((b) => b.team_id === null));
    const teamBoards = useAppSelector((state) => Object.values(state.boards).filter((b) => b.team_id !== null));

    useEffect(() => {}, [personalBoards, teamBoards]);

    return (
        <div className="boards-page">
            <div className="your-boards">Your Boards</div>
            {personalBoards.map((board: Board) => (
                <BoardCard board_id={board.id} key={board.id} />
            ))}

            <div className="shared-with-you">Shared with you</div>
            {teamBoards ? teamBoards.map((board: Board) => (
                <BoardCard board_id={board.id} key={board.id} />
            )) : <div className="no-boards-message">no one has shared a board with you yet</div> }

        </div>
    )

}