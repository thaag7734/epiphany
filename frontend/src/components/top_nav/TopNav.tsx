import "./TopNav.css";
import UserDropdown from "./user_dropdown/UserDropdown";

export default function TopNav() {
  return (
    <nav className="topNav">
      <div className="userButtons">
        <UserDropdown />
      </div>
    </nav>
  );
}
