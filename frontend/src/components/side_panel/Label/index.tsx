import { useAppSelector } from "../../../redux/hooks";
import { LabelsState } from "../../../redux/reducers/labels";

export default function Label() {
   const labels: LabelsState = useAppSelector((state) => state.labels);
   const labelsArr = Object.values(labels);

   if (!labelsArr.length) return <h3>Loading Labels...</h3>;

   return (
      <div className="labels-box">
         {labelsArr.map(({ name, id }) => (
            <div key={id}>{name}</div>
         ))}
         {/************************************/}
         {/*  Placeholder for new label modal */}
         {/************************************/}
      </div>
   );
}
