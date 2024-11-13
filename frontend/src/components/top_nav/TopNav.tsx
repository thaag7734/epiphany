// import { IoIosHelpCircle } from "react-icons/io";
import FileDropdown from "./file_dropdown";
import "./TopNav.css";
import UserDropdown from "./user_dropdown/UserDropdown";

export default function TopNav() {
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
