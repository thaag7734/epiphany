import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { logout } from "../../../redux/reducers/session";
import { FaUserCircle } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { ModalContextType, useModal } from "../../Modal/Modal";
import TeamsModal from "../../TeamsModal/TeamsModal";
import { NavLink } from "react-router-dom";
import { TeamState } from "../../../redux/reducers/teams";
import { Team } from "../../../types/Models";

export default function UserDropdown() {
   const [isOpen, setIsOpen] = useState(false);
   const { setModalContent } = useModal() as ModalContextType;
   const [isDepressed, setIsDepressed] = useState<boolean>(false);
   const dispatch = useAppDispatch();
   const navigate = useNavigate();
   const team: TeamState = useAppSelector((state) => state.team);
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

   const endSession = (e: React.MouseEvent) => {
      e.preventDefault();
      dispatch(logout());
      navigate("/");
   };

   return (
      <div className="dropdown" ref={(node) => (thisRef = node)}>
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
                  <li onClick={launchTeamsModal}>Create Team</li>
               )}
            </ul>
         )}
      </div>
   );
}
