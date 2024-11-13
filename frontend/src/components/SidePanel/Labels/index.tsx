import { useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { deleteLabel, type LabelsState } from "../../../redux/reducers/labels";
import NewLabel from "../NewLabel/NewLabel";
import { FaTrash } from "react-icons/fa";

export default function Labels() {
  const labels: LabelsState = useAppSelector((state) => state.labels);
  const isOverflowing = useRef(false);
  const labelsArr = Object.values(labels);
  const dispatch = useAppDispatch();

  const handleDelete = (labelId: number) => {
    const timeout = setTimeout(() => {
      dispatch(deleteLabel(labelId));
      // TODO error handling if deletion fails
    }, 3000);

    addEventListener(
      "mouseup",
      () => {
        clearTimeout(timeout);
      },
      { once: true },
    );
  };

  if (labelsArr.length > 5) {
    isOverflowing.current = true;
  }

  return (
    <div>
      {!labelsArr.length ? (
        <h3>Loading Labels...</h3>
      ) : (
        <div
          className={
            isOverflowing.current ? "labels-box overflowing" : "labels-box"
          }
        >
          {labelsArr.map(({ name, id }) => (
            <div key={id} className="label">
              <div
                className="delete-btn"
                onMouseDown={() => handleDelete(id)}
                title="Hold 3s to delete"
              >
                <FaTrash />
              </div>
              {name}
            </div>
          ))}
          <NewLabel />
        </div>
      )}
    </div>
  );
}
