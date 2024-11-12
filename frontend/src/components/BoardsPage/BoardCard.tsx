import { useEffect } from "react";
import { useAppSelector } from "../../redux/hooks";
import type { User, Label, Note, Board } from "../../types/Models";
import "./BoardCard.css";
import { useNavigate } from "react-router";



export default function BoardCard({ board_id }: {board_id: number}) {
    const board = useAppSelector((state) => Object.values(state.boards).find((b) => b.id === board_id));
    const labels = useAppSelector((state) => Object.values(state.labels).filter((l) => l.board_id === board_id));

    const navigate = useNavigate();

    useEffect(() => {}, [board]);

    const handleBoardClick = () => {
        navigate(`/boards/${board_id}`);
    }

    return (
        <>
        { board ? (
            <div
            key={board.id}
            className="board-card"
            onClick={() => handleBoardClick()}
            title={board.name}
            >
                <div className="board-name">{board.name}</div>
                <ul className="board-labels-list">
                {labels?.map((label) => (
                    <li 
                    key={label.id}
                    className="board-label-pill"
                    >
                        {label.name}
                    </li>
                ))}
                </ul>
            </div>
        ): null }
        </>
    )
}