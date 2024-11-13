import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { logout } from "../../../redux/reducers/session";
import { FaUserCircle } from "react-icons/fa";
import { useAppDispatch } from "../../../redux/hooks";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  let thisRef: HTMLDivElement | null = null;

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
        className="dropdown-button-user"
        onClick={toggleDropdown}
      >
        <FaUserCircle />
      </button>
      {isOpen && (
        <ul className="dropdown-menu-user">
          <li>
            <button type="button" onClick={endSession}>
              Logout
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
