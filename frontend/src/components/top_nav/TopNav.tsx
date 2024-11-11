import { useAppSelector, useAppDispatch } from "/../../redux/hooks";
import { useEffect } from "react";
import { User, Board, Note, Label, Team } from "/../../types/Models";
// import { IoIosHelpCircle } from "react-icons/io";
import FileDropdown from "./file_dropdown";
import { useNavigate } from "react-router";
import "./TopNav.css";
import UserDropdown from "./user_dropdown/UserDropdown";

export default function TopNav({boardId}:{boardId: number}) {
  const navigate = useNavigate();

  return (
    <nav className="topNav">
      <div className="file">
        <FileDropdown />
      </div>
      <div className="userButtons">
        <UserDropdown />
        {/* <IoIosHelpCircle /> */}
      </div>
    </nav>
  );
}
