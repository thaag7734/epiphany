import { labelsSlice } from "./labels";
import { notesSlice } from "./notes";
import { sessionSlice } from "./session";
import { teamSlice } from "./teams";
import { boardsSlice } from "./boards";

const labelsReducer = labelsSlice.reducer;
const notesReducer = notesSlice.reducer;
const sessionReducer = sessionSlice.reducer;
const boardsReducer = boardsSlice.reducer;
const teamReducer = teamSlice.reducer;

export {
  labelsReducer,
  notesReducer,
  sessionReducer,
  teamReducer,
  boardsReducer,
};
