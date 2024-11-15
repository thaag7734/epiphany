import { MouseEvent } from "react";
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
                    <img
                        id="logo"
                        src="/epiphany.svg"
                        alt="An image of the application logo which reads 'Epiphany: Whatever comes to mind'"
                    />
                    <Labels />
                </div>
            </div>
        </>
    );
}
