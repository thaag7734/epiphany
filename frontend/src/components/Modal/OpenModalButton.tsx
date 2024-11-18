import type { MouseEvent, MouseEventHandler, ReactNode } from "react";
import { useModal } from "./Modal";
import type { ModalContextType } from "./Modal";

function OpenModalButton({
  modalComponent, // component to render inside the modal
  buttonText, // text of the button that opens the modal
  onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
  onModalClose, // optional: callback function that will be called once the modal is closed
  className,
}: {
  modalComponent: ReactNode;
  buttonText: string;
  onButtonClick: MouseEventHandler;
  onModalClose: CallableFunction;
  className: string;
}) {
  const { setModalContent, setOnModalClose } = useModal() as ModalContextType;

  const onClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onButtonClick === "function") onButtonClick(e);
  };

  return (
    <button type="button" className={className} onClick={onClick}>
      {buttonText}
    </button>
  );
}

export default OpenModalButton;
