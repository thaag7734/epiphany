import { useEffect, useState } from "react";
import type React from "react";
import { NavLink } from "react-router-dom";
import { type ModalContextType, useModal } from "../../Modal/Modal";
import TeamsModal from "../../TeamsModal/TeamsModal";
import { useAppSelector } from "../../../redux/hooks";
import type { Team } from "../../../types/Models";

export default function FileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { setModalContent } = useModal() as ModalContextType;
  const team = useAppSelector((state) => state.team.team);
  const user = useAppSelector((state) => state.session.user);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  let thisRef: HTMLDivElement | null = null;

  const launchTeamsModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModalContent(<TeamsModal />);
  };

  useEffect(() => {
    const closeMenu = (e: MouseEvent) => {
      if (thisRef && !thisRef.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  });

  return (
    <div className="dropdown" ref={(node) => (thisRef = node)}>
      <button className="dropdown-button-file" onClick={toggleDropdown}>
        File
      </button>
      {isOpen && (
        <ul className="dropdown-menu-file">
          <li>
            <NavLink to={"/boards"}>Manage Boards</NavLink>
          </li>
          {team && (team as Team).owner_id === user?.id ? (
            <li>
              <p onClick={launchTeamsModal}>Manage Team</p>
            </li>
          ) : (
            <li>
              <p onClick={launchTeamsModal}>Create Team</p>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
