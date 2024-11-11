import { MouseEvent, useEffect, useState } from 'react';
import { useNavigate } from "react-router";
import { NavLink, Link } from 'react-router-dom';


export default function FileDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = (e: MouseEvent) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  let thisRef:HTMLDivElement | null = null 

useEffect(() => {
  const closeMenu = (e) => {
    if (thisRef && !thisRef.contains(e.target)) {
      setIsOpen(false)
    }
  };

  document.addEventListener("click", closeMenu);
 
  return () => document.removeEventListener("click", closeMenu);
});


  return (
    <div className="dropdown" ref={(node)=>thisRef=node}>
      <button className="dropdown-button-file" onClick={toggleDropdown}>
        File
      </button>
      {isOpen && (
        <ul className="dropdown-menu-file">
          <li>
            <NavLink to={'/boards'}>Manage Boards</NavLink>
          </li>
          <li>
            <p>Manage Teams - todo Modal</p>
          </li>
        </ul>
      )}
    </div>
  );
};