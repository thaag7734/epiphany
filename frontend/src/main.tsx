import { Provider } from "react-redux";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { store } from "./redux/store";
import App from "./App.tsx";
import { Modal, ModalProvider } from "./components/Modal/Modal";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ModalProvider>
      <Provider store={store}>
        <App />
        <Modal />
      </Provider>
    </ModalProvider>
  </StrictMode>
);
