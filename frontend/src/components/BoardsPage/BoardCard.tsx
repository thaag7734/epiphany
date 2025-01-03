import { type MouseEvent, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import "./BoardCard.css";
import { useNavigate } from "react-router";
import { FaTrash } from "react-icons/fa";
import { deleteBoard, selectBoardById } from "../../redux/reducers/boards";
import {
  getBoardLabels,
  selectLabelsByBoardId,
} from "../../redux/reducers/labels";
import { FaUserGroup } from "react-icons/fa6";

export default function BoardCard({
  board_id,
  owned,
}: { board_id: number; owned?: boolean }) {
  const board = useAppSelector((state) => selectBoardById(state, board_id));
  const labels = useAppSelector((state) =>
    board ? selectLabelsByBoardId(state, board.id) : null,
  );

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!board) return;

    dispatch(getBoardLabels(board.id));
  }, [board]);

  const handleBoardClick = () => {
    navigate(`/boards/${board_id}`);
  };

  const handleDeleteBoard = (e: MouseEvent, boardId: number) => {
    e.stopPropagation();

    const timeout = setTimeout(() => {
      dispatch(deleteBoard(boardId));
      // TODO error handling if deletion fails
    }, 1500);

    addEventListener(
      "mouseup",
      () => {
        clearTimeout(timeout);
      },
      { once: true },
    );
  };

  return (
    <>
      {board ? (
        <div
          key={board.id}
          className="board-card"
          onClick={() => handleBoardClick()}
          title={board.name}
        >
          {board.team_id && (
            <div
              className="board-share-icon"
              title="You are sharing this board"
            >
              <FaUserGroup />
            </div>
          )}
          <div className="board-name">{board.name}</div>

          <div className="board-card-actions">
            {owned && (
              <div
                className="board-delete-icon"
                title="Hold 2s to delete board"
                onMouseDown={(e) => handleDeleteBoard(e, board.id)}
                onClick={(e) => e.stopPropagation()}
              >
                <FaTrash />
              </div>
            )}
            <ul className="board-labels-list">
              {labels?.map((label) => (
                <li key={label.id} className="board-label-pill">
                  {label.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
