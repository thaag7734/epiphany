import {
  type MouseEvent,
  type ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import type React from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  deleteLabel,
  getBoardLabels,
  updateLabel,
  type LabelsState,
} from "../../../redux/reducers/labels";
import type { LabelFormData } from "../../../types/FormData";
import NewLabel from "../NewLabel/NewLabel";
import { FaTrash } from "react-icons/fa";
import { FaFilter } from "react-icons/fa6";
import { useParams } from "react-router";
import ErrorMessage from "../../ErrorMessage";

export default function Labels() {
  const { boardId } = useParams();
  const labels: LabelsState = useAppSelector((state) => state.labels);
  const isOverflowing = useRef(false);
  const labelsArr = Object.values(labels);
  const [isFilterClicked /*, setIsFilterClicked*/] = useState(0);
  const [trashing, setTrashing] = useState(0);
  const dispatch = useAppDispatch();
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<ReactElement | null>(null);

  useEffect(() => {
    if (!boardId) return;

    dispatch(getBoardLabels(Number(boardId))).then(() => {
      setLoaded(true);
    });
  }, [dispatch, boardId]);

  const handleDelete = (labelId: number) => {
    const timeout = setTimeout(() => {
      dispatch(deleteLabel(labelId));
      // TODO error handling if deletion fails
    }, 1500);

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

  const renderLabelEditInput = (e: MouseEvent): void => {
    const target = (e.currentTarget as HTMLDivElement)
      .children[0] as HTMLSpanElement;
    const inputName = document.createElement("input");
    inputName.value = target.title ? target.title : target.innerText;
    const temp = inputName.value;
    inputName.id = "edit-label";
    target.innerText = "";
    inputName.onblur = () => handleEdit(target, inputName, temp);
    target.appendChild(inputName);
    inputName.focus();
  };

  const handleEdit = async (
    targ: HTMLSpanElement,
    inputEle: HTMLInputElement,
    oldName: string,
  ): Promise<void> => {
    if (inputEle.value.length > 24) {
      setError(<ErrorMessage msg="Name cannot be more than 24 characters" />);
      return;
    }
    if (!inputEle.value.length) {
      targ.innerText = oldName;
      return;
    }
    targ.innerText = inputEle.value;
    inputEle.remove();
    if (targ.innerText === oldName) return;
    setError(null);

    const newLabel: LabelFormData = {
      id: Number((targ.parentElement as HTMLDivElement).dataset.id),
      name: targ.dataset.name!,
      board_id: Number(boardId),
    };
    await dispatch(updateLabel(newLabel));
  };

  const closeSidePanel = (e: React.DragEvent, id: number) => {
    const sidePanel = document.querySelector("#side-panel-show");
    if (!sidePanel) return;
    e.dataTransfer.clearData();
    e.dataTransfer.setData("text/plain", `${id}`);
    sidePanel.id = "side-panel";
  };

  return (
    <>
      {!loaded ? (
        <h3>Loading Labels...</h3>
      ) : (
        <>
          {labelsArr.length ? (
            <div
              className={
                isOverflowing.current ? "labels-box overflowing" : "labels-box"
              }
            >
              {/* TODO refactor this to properly use keys */}
              {labelsArr.map(({ name, id }) => (
                <>
                  <div
                    key={`label-${id}`}
                    className="label"
                    draggable
                    onDoubleClick={renderLabelEditInput}
                    title={name.length > 6 ? name : undefined}
                    onDragStart={(e) => closeSidePanel(e, id)}
                    id={`label-${id}`}
                    data-id={`${id}`}
                  >
                    <span
                      id={`label-name-${id}`}
                      className="label-span"
                      data-name={name}
                    >
                      {name}
                    </span>
                  </div>
                  <FaFilter
                    key={`filter-${id}`}
                    className={`filter-btn${isFilterClicked === id ? " clicked" : ""
                      }`}
                    data-id={`${id}`}
                    onClick={() => alert("Filtering not yet implemented :(")}
                  />
                  {/*onClick={(e) => {
                    if (e.currentTarget.dataset.id === `${id}`) {
                      setIsFilterClicked(isFilterClicked === id ? 0 : id);
                    }
                  }}*/}
                  <FaTrash
                    key={`trash-${id}`}
                    className={`trash-btn${trashing === id ? " clicked" : ""}`}
                    data-id={`${id}`}
                    onMouseDown={(e) => {
                      if (e.currentTarget.dataset.id === `${id}`) {
                        setTrashing(id);
                      }
                      handleDelete(id);
                    }}
                    onMouseUp={() => {
                      setTrashing(0);
                    }}
                    title="Hold 3s to delete"
                  />
                </>
              ))}
            </div>
          ) : (
            <h3>No Labels</h3>
          )}
          {error}
        </>
      )}
      <NewLabel />
    </>
  );
}
