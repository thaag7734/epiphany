import { useState } from "react";
import Labels from "./Labels";
import { SlArrowRight } from "react-icons/sl";
import "./index.css";

export default function SidePanel() {
  const [isVisible, setIsVisible] = useState(false);

  const setSidePanel = (e) => {
    if (e.target.id !== "side-panel") {
      setIsVisible(!isVisible);
    }
  };

  return (
    <>
      <div
        onMouseEnter={setSidePanel}
        className={isVisible ? "arrow-box-hidden" : "arrow-box"}
      >
        <SlArrowRight />
      </div>
      <div
        id={isVisible ? "side-panel-show" : "side-panel"}
        onMouseLeave={setSidePanel}
      >
        <img
          id="logo"
          src="/epiphany.svg"
          alt="An image of the application logo which reads 'Epiphany: Whatever comes to mind'"
        />
        <Labels />
      </div>
    </>
  );
}
