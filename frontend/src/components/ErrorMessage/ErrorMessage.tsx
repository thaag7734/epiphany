import { ReactElement } from "react";

export default function ErrorSpan({ msg }:{msg: string}) : ReactElement | null {
      return msg ? <span className="errorMessage">{msg}</span> : null;
    }