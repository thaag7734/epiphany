import { labelsSlice } from "./labels";
import { notesSlice } from "./notes";
import { sessionSlice } from "./session";
//import teamsReducer from "./teams";
import { boardsSlice } from "./boards";

const labelsReducer = labelsSlice.reducer;
const notesReducer = notesSlice.reducer;
const sessionReducer = sessionSlice.reducer;
const boardsReducer = boardsSlice.reducer;

export {
  labelsReducer,
  notesReducer,
  sessionReducer,
  //teamsReducer,
  boardsReducer,
};
