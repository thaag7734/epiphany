import { labelsSlice } from "./labels";
import { notesSlice } from "./notes";
import { sessionSlice } from "./session";
//import teamsReducer from "./teams";
//import boardsReducer from "./boards";

const labelsReducer = labelsSlice.reducer;
const notesReducer = notesSlice.reducer;
const sessionReducer = sessionSlice.reducer;

export {
  labelsReducer,
  notesReducer,
  sessionReducer,
  //teamsReducer,
  //boardsReducer,
};
