import type { MouseEvent } from "react";
import Labels from "./Labels";
import "./index.css";

export default function SidePanel() {
  const setSidePanel = (e: MouseEvent): void => {
    e.stopPropagation();
    e.currentTarget.id = "side-panel";
  };

  return (
    <>
      <div id="side-panel" onMouseLeave={setSidePanel}>
        <div id="side-panel-content">
          <img id="logo" src="/epiphany-notext.svg" alt="Epiphany" />
          <Labels />
        </div>
      </div>
    </>
  );
}
