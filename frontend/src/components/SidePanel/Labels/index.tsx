import { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { deleteLabel, type LabelsState } from "../../../redux/reducers/labels";
import NewLabel from "../NewLabel/NewLabel";
import { FaTrash } from "react-icons/fa";
import { TbFilterPlus } from "react-icons/tb";

export default function Labels() {
   const labels: LabelsState = useAppSelector((state) => state.labels);
   const isOverflowing = useRef(false);
   const labelsArr = Object.values(labels);
   const [isFilterClicked, setIsFilterClicked] = useState(false);
   const [isTrashClicked, setIsTrashClicked] = useState(false);
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
         { once: true }
      );
   };

   if (labelsArr.length > 5) {
      isOverflowing.current = true;
   }

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
                     <div
                        style={{
                           display: "flex",
                           columnGap: "0.2vw",
                           alignItems: "center",
                           marginInline: "0.5vw",
                        }}
                     >
                        <div
                           key={id}
                           className="label"
                           draggable
                           title={name.length > 6 ? name : undefined}
                        >
                           {name.length > 6 ? name.slice(0, 6) + "..." : name}
                        </div>
                        <div
                           style={{
                              display: "flex",
                              flexDirection: "column",
                              rowGap: "0.3vw",
                           }}
                        >
                           <TbFilterPlus
                              className={`filter-btn${
                                 isFilterClicked ? " clicked" : ""
                              }`}
                              id={`${id}`}
                              onClick={() =>
                                 setIsFilterClicked(!isFilterClicked)
                              }
                           />
                           <FaTrash
                              className={`trash-btn${
                                 isTrashClicked ? " clicked" : ""
                              }`}
                              id={`${id}`}
                              onMouseDown={() => {
                                 setIsTrashClicked(true);
                                 handleDelete(id);
                              }}
                              onMouseUp={() => {
                                 setIsTrashClicked(false);
                              }}
                              title="Hold 3s to delete"
                           />
                        </div>
                     </div>
                  ))}
               </div>
               <NewLabel />
            </>
         )}
      </>
   );
}
