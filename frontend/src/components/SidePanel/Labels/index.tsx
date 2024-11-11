import { useRef } from "react";
import { useAppSelector } from "../../../redux/hooks";
import { LabelsState } from "../../../redux/reducers/labels";

export default function Labels() {
   const labels: LabelsState = useAppSelector((state) => state.labels);
   const isOverflowing = useRef(false);
   const labelsArr = Object.values(labels);

   if (!labelsArr.length) return <h3>Loading Labels...</h3>;

   if (labelsArr.length > 5) {
      isOverflowing.current = true;
   }

   return (
      <div className={`labels-box ${isOverflowing ? "overflowing" : ""}`}>
         {labelsArr.map(({ name, id }) => (
            <div key={id}>{name}</div>
         ))}
         {/************************************/}
         {/*  Placeholder for new label modal */}
         {/************************************/}
         <a>Hello from Labels</a>
      </div>
   );
}
