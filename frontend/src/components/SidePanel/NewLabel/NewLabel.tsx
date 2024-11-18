import { useState } from "react";
import { useParams } from "react-router";
import { createLabel } from "../../../redux/reducers/labels";
import { useAppDispatch } from "../../../redux/hooks";

export default function NewLabel() {
  const { boardId } = useParams();
  const [name, setName] = useState<string>("");
  const dispatch = useAppDispatch();

  const handleCreate = async (e: React.FocusEvent | React.KeyboardEvent) => {
    if (name.length > 24) {
      (e.target as HTMLElement).style.backgroundColor = "red";
      return;
    }

    dispatch(
      createLabel({
        board_id: Number(boardId),
        name,
      }),
    ).then(() => setName(""));
  };

  return (
    <>
      <div className="new-label">
        <input
          type="text"
          name="name"
          placeholder="Create a new label"
          value={name}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleCreate}
        />
      </div>
      {/*<input type="date" />*/}
    </>
  );
}
