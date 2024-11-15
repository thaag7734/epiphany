import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { logout } from "../../../redux/reducers/session";
import { FaUserCircle } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { type ModalContextType, useModal } from "../../Modal/Modal";
import TeamsModal from "../../TeamsModal/TeamsModal";
import { NavLink } from "react-router-dom";
import { teamSlice, type TeamState } from "../../../redux/reducers/teams";
import type { Board, Team } from "../../../types/Models";
import { labelsSlice } from "../../../redux/reducers/labels";
import { notesSlice } from "../../../redux/reducers/notes";
import { boardsSlice } from "../../../redux/reducers/boards";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDepressed, setIsDepressed] = useState<boolean>(false);
  const { setModalContent } = useModal() as ModalContextType;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const team: TeamState = useAppSelector((state) => state.team);
  const user = useAppSelector((state) => state.session.user);
  const currentBoardId = useAppSelector(
    (state) => state.session.currentBoardId
  );
  const board = useAppSelector((state) => state.boards[currentBoardId!]);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const thisRef = useRef<HTMLDivElement | null>(null);
  const launchTeamsModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModalContent(<TeamsModal />);
  };

  useEffect(() => {
    const closeMenu = (e: MouseEvent) => {
      if (thisRef && !thisRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  });

  const endSession = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(logout());
    dispatch(labelsSlice.actions.clearState());
    dispatch(notesSlice.actions.clearState());
    dispatch(boardsSlice.actions.clearState());
    dispatch(teamSlice.actions.clearState());
    navigate("/");
  };

  return (
    <div className="dropdown" ref={thisRef}>
      <button
        type="button"
        className={`dropdown-button-user${isDepressed ? " depressed" : ""}`}
        onMouseUp={(e) => {
          setIsDepressed(false);
          toggleDropdown(e);
        }}
        onMouseDown={() => setIsDepressed(true)}
      >
        <FaUserCircle />
      </button>
      {isOpen && (
        <ul className="dropdown-menu-user">
          <li>Welcome, {user?.username}</li>
          <li onClick={endSession}>Logout </li>
          <li>
            <NavLink to={"/boards"}>Manage Boards</NavLink>
          </li>
          {team && (team as Team).owner_id === user?.id ? (
            <li onClick={launchTeamsModal}>Manage Team</li>
          ) : (
            (board as Board)?.owner_id === user?.id! && (
              <li onClick={launchTeamsModal}>Create Team</li>
            )
          )}
        </ul>
      )}
    </div>
  );
}
