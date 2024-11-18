import type { ReactElement } from "react";
import "./ErrorMessage.css";

export default function ErrorMessage({
    msg,
}: {
    msg: string;
}): ReactElement | null {
    return msg ? <span className="error-message">{msg}</span> : null;
}
