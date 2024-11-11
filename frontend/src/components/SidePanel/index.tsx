import { useState } from "react";
import Labels from "./Labels";
import { SlArrowLeft } from "react-icons/sl";

export default function SidePanel() {
   const [isVisible, setIsVisible] = useState(true);
   return (
      <div id="side-panel" className={`${isVisible ? "show" : "hide"}`}>
         <div onClick={() => setIsVisible(!isVisible)}>
            <span>
               <SlArrowLeft />
            </span>
         </div>
         <img
            id="logo"
            src="/epiphany.svg"
            alt="An image of the application logo which reads 'Epiphany: Whatever comes to mind'"
         />
         <Labels />
      </div>
   );
}
