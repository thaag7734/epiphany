import { useRef } from "react";
import { useAppSelector } from "../../../redux/hooks";
import { LabelsState } from "../../../redux/reducers/labels";
import { useParams } from "react-router";

export default function Labels() {
   const labels: LabelsState = useAppSelector((state) => state.labels);
   const { boardId } = useParams();
   const isOverflowing = useRef(false);
   const labelsArr = Object.values(labels);

   if (labelsArr.length > 5) {
      isOverflowing.current = true;
   }

   return (
      <>
         {!labelsArr.length ? (
            <h3>Loading Labels...</h3>
         ) : (
            <div
               className={
                  isOverflowing.current
                     ? "labels-box overflowing"
                     : "labels-box"
               }
            >
               {labelsArr.map(({ name, id }) => (
                  <div key={id} className="label">
                     {name}
                  </div>
               ))}
               {/*********************************/}
               {/** Placeholder for label modal **/}
               {/*********************************/}
            </div>
         )}
      </>
   );
}
