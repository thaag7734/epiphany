import "./TopNav.css";
import UserDropdown from "./user_dropdown/UserDropdown";
import { SlArrowRight } from "react-icons/sl";

export default function TopNav() {
   function showSidePanel(): void {
      const sidePanel = document.querySelector("#side-panel");
      if (!sidePanel) return;
      sidePanel.id = sidePanel.id.concat("-show");
   }

   return (
      <nav className="topNav">
         <SlArrowRight onMouseEnter={showSidePanel} className="arrow-box" />
         <div className="userButtons">
            <UserDropdown />
         </div>
      </nav>
   );
}
