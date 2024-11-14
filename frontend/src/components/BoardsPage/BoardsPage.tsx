import { useEffect } from "react";
import { useAppSelector } from "../../redux/hooks";
import type { Board } from "../../types/Models";
import BoardCard from "./BoardCard";
import "./BoardsPage.css";

export default function BoardsPage() {
  const personalBoards = useAppSelector((state) =>
    Object.values(state.boards).filter((b) => b.team_id === null),
  );
  const teamBoards = useAppSelector((state) =>
    Object.values(state.boards).filter((b) => b.team_id !== null),
  );

  useEffect(() => { }, [personalBoards, teamBoards]);

  return (
    <div className="boards-page">
      <div className="your-boards">Your Boards</div>
      
      <div className="cards-container">
      {personalBoards.map((board: Board) => (
        <BoardCard board_id={board.id} key={board.id} />
      ))}
      </div>

      <div className="shared-with-you">Shared with you</div>

      <div className="cards-container">
      {teamBoards ? (
        teamBoards.map((board: Board) => (
          <BoardCard board_id={board.id} key={board.id} />
        ))
      ) : (
        <div className="no-boards-message">
          no one has shared a board with you yet
        </div>
      )}
      </div>

    </div>
  );
}
