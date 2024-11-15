import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import type { Board } from "../../types/Models";
import BoardCard from "./BoardCard";
import "./BoardsPage.css";
import NewCardButton from "../NewCardCard/NewCardButton";
import { createBoard, selectAllBoards } from "../../redux/reducers/boards";

export default function BoardsPage() {
  const boards = useAppSelector((state) => selectAllBoards(state));
  const user = useAppSelector((state) => state.session.user);

  const dispatch = useAppDispatch();

  useEffect(() => { }, [boards]);

  const handleCreateBoard = async () => {
    if (!user) return;

    dispatch(
      createBoard({
        owner_id: user.id,
        name: `${user.username}'s Board`,
      }),
    ); //TODO show toast on success/error
  };

  return (
    <div className="boards-page">
      <div className="your-boards">Your Boards</div>

      <div className="cards-container">
        {boards
          ?.filter((b) => b.owner_id === user?.id)
          .map((board: Board) => (
            <BoardCard owned={true} board_id={board.id} key={board.id} />
          ))}
        <NewCardButton onClick={handleCreateBoard} />
      </div>

      <div className="shared-with-you">Shared with you</div>

      <div className="cards-container">
        {boards.filter((b) => b.owner_id !== user?.id).length ? (
          boards
            .filter((b) => b.owner_id !== user?.id)
            .map((board: Board) => (
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
