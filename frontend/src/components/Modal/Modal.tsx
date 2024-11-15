import { useRef, useState, useContext, createContext } from "react";
import type { ReactNode, RefObject, LegacyRef } from "react";
import ReactDOM from "react-dom";
import "./Modal.css";

export interface ModalContextType {
    modalRef: RefObject<Element | undefined>;
    modalContent: ReactNode | null;
    setModalContent: CallableFunction;
    setOnModalClose: CallableFunction;
    closeModal: () => void;
}

export function ModalProvider({ children }: { children: ReactNode }) {
    const modalRef = useRef<Element>(null) as RefObject<Element>;
    const [modalContent, setModalContent] = useState(null);
    // callback function that will be called when modal is closing
    const [onModalClose, setOnModalClose] = useState<CallableFunction | null>(
        null
    );

    const closeModal = () => {
        setModalContent(null); // clear the modal contents
        // If callback function is truthy, call the callback function and reset it
        // to null:
        if (typeof onModalClose === "function") {
            setOnModalClose(null);
            onModalClose();
        }
    };

    const contextValue: ModalContextType = {
        modalRef, // reference to modal div
        modalContent, // React component to render inside modal
        setModalContent, // function to set the React component to render inside modal
        setOnModalClose, // function to set the callback function called when modal is closing
        closeModal, // function to close the modal
    };

    return (
        <>
            <ModalContext.Provider value={contextValue}>
                {children}
            </ModalContext.Provider>
            <div ref={modalRef as LegacyRef<HTMLDivElement>} />
        </>
    );
}

const ModalContext = createContext<ModalContextType | null>(null);

export function Modal() {
    const { modalRef, modalContent, closeModal } = useContext(
        ModalContext
    ) as ModalContextType;
    // If there is no div referenced by the modalRef or modalContent is not a
    // truthy value, render nothing:
    if (!modalRef || !modalRef.current || !modalContent) return null;

    // Render the following component to the div referenced by the modalRef
    return ReactDOM.createPortal(
        <div id="modal">
        <div id="modal-background" onMouseDown={closeModal}>
        </div>
            <div className="modal-content">{modalContent}</div>
        </div>,
        modalRef.current
    );
}

export const useModal = () => useContext(ModalContext);
