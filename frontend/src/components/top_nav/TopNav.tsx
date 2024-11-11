import { useAppSelector, useAppDispatch } from "/../../redux/hooks";
import { useEffect } from "react";
import { User, Board, Note, Label, Team } from "/../../types/Models";
import { useNavigate } from "react-router";

export default function TopNav() {
  const navigate = useNavigate();

  return (
    <nav className="topNav">
      <div className="file">
        <p>file</p>
      </div>
      <div className="userButtons">

      </div>
    </nav>
  );
}
