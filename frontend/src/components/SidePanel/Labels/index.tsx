import { type MouseEvent, type ReactElement, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
    deleteLabel,
    updateLabel,
    type LabelsState,
} from "../../../redux/reducers/labels";
import type { LabelFormData } from "../../../types/FormData";
import { getCsrf } from "../../../util/cookies";
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
    const [isFilterClicked, setIsFilterClicked] = useState(0);
    const [trashing, setTrashing] = useState(0);
    const dispatch = useAppDispatch();
    const [error, setError] = useState<ReactElement | null>(null);

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
            { once: true }
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
        oldName: string
    ): Promise<void> => {
        if (inputEle.value.length > 24) {
            setError(
                <ErrorMessage msg="Name cannot be more than 24 characters" />
            );
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
            csrf_token: await getCsrf(),
            id: Number((targ.parentElement as HTMLDivElement).dataset.id),
            name: targ.dataset.name!,
            board_id: Number(boardId),
        };
        await dispatch(updateLabel(newLabel));
    };

    const closeSidePanel = () => {
        const sidePanel = document.querySelector("#side-panel-show");
        if (!sidePanel) return;
        sidePanel.id = "side-panel";
    };

    return (
        <>
            {!labelsArr.length ? (
                <h3>Loading Labels...</h3>
            ) : (
                <>
                    <div
                        className={
                            isOverflowing.current
                                ? "labels-box overflowing"
                                : "labels-box"
                        }
                    >
                        {labelsArr.map(({ name, id }) => (
                            <>
                                <div
                                    key={id}
                                    className="label"
                                    draggable
                                    onDoubleClick={renderLabelEditInput}
                                    title={name.length > 6 ? name : undefined}
                                    onDragStart={closeSidePanel}
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
                                    className={`filter-btn${
                                        isFilterClicked === id ? " clicked" : ""
                                    }`}
                                    data-id={`${id}`}
                                    onClick={(e) => {
                                        if (
                                            e.currentTarget.dataset.id ===
                                            `${id}`
                                        ) {
                                            setIsFilterClicked(
                                                isFilterClicked === id ? 0 : id
                                            );
                                        }
                                    }}
                                />
                                <FaTrash
                                    className={`trash-btn${
                                        trashing === id ? " clicked" : ""
                                    }`}
                                    data-id={`${id}`}
                                    onMouseDown={(e) => {
                                        if (
                                            e.currentTarget.dataset.id ===
                                            `${id}`
                                        ) {
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
                    {error}
                </>
            )}
            <NewLabel />
        </>
    );
}
