import type { MouseEventHandler } from "react";
import { BsFillPlusSquareFill } from "react-icons/bs";
import "./NewCardButton.css";

export default function NewCardButton({
  onClick,
}: { onClick: MouseEventHandler }) {
  return (
    <button type="button" className="new-card-button" tabIndex={0}>
      <BsFillPlusSquareFill onClick={onClick} />
    </button>
  );
}
