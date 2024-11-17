import "./TopNav.css";
import UserDropdown from "./user_dropdown/UserDropdown";
import { SlArrowRight } from "react-icons/sl";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useRef, useState } from "react";
import { TeamState, updateTeam } from "../../redux/reducers/teams";
import { getCsrf } from "../../util/cookies";
import { Team, User } from "../../types/Models";
import { useNavigate } from "react-router";
import { boardsSlice } from "../../redux/reducers/boards";

export default function TopNav() {
  const [awaitingDelConf, setAwaitingDelConf] = useState<boolean>(false);
  const [deleteBtnContent, setDeleteBtnContent] =
    useState<string>("Leave Team");
  const deleteBtn = useRef<HTMLDivElement | null>(null);

  const currentBoardId = useAppSelector(
    (state) => state.session.currentBoardId,
  );
  const user = useAppSelector((state) => state.session.user);
  //   const board = useAppSelector((state) => state.boards[currentBoardId!]);
  const team: TeamState = useAppSelector((state) => state.team);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function showSidePanel(): void {
    const sidePanel = document.querySelector("#side-panel");
    if (!sidePanel) return;
    sidePanel.id = sidePanel.id.concat("-show");
  }

  const handleDelete = async () => {
    if (!team?.id || !deleteBtn.current) return;

    if (!awaitingDelConf) {
      deleteBtn.current.addEventListener(
        "mouseleave",
        () => {
          setDeleteBtnContent("Leave Team");
          setAwaitingDelConf(false);
        },
        { once: true },
      );

      setAwaitingDelConf(true);

      setDeleteBtnContent("Click again to leave team");
    } else {
      setAwaitingDelConf(false);

      dispatch(
        updateTeam({
          owner_id: (user as User).id,
          emails: team.emails.filter(
            (el: string) => el !== (user as User).email,
          ),
          team_id: (team as Team).id,
        }),
      ).then(() => {
        boardsSlice.actions.clearState();
        navigate("/boards");
      });
    }
  };

  //   const setRootBoard = () => {

  //   };

  return (
    <nav className="top-nav">
      <SlArrowRight
        onMouseEnter={showSidePanel}
        className={`arrow-box ${currentBoardId ? "" : "invisible"}`}
      />
      <div className="user-buttons">
        {/* {user?.root_board_id !== currentBoardId &&
          board.owner_id === user?.id && (
            <div className="set-home" onMouseDown={setRootBoard}>
              Set as home board
            </div>
          )} */}
        {team && team.owner_id !== user?.id && (
          <div
            className="leave-team"
            onMouseDown={handleDelete}
            ref={deleteBtn}
          >
            {deleteBtnContent}
          </div>
        )}
        <UserDropdown />
      </div>
    </nav>
  );
}
