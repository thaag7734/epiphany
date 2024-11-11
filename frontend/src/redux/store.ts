import { configureStore } from "@reduxjs/toolkit";
import {
  sessionReducer,
  labelsReducer,
  notesReducer,
  boardsReducer,
  teamReducer,
} from "./reducers/index";
import { createLogger } from "redux-logger";

const logger = createLogger();

export const store = configureStore({
  devTools: true,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  reducer: {
    session: sessionReducer,
    notes: notesReducer,
    labels: labelsReducer,
    boards: boardsReducer,
    team: teamReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
