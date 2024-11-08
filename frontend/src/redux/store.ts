import { configureStore } from "@reduxjs/toolkit";
import {
   sessionReducer,
   notesReducer,
   labelsReducer,
   boardsReducer,
   teamsReducer,
} from "./reducers";

export const store = configureStore({
   reducer: {
      session: sessionReducer,
      notes: notesReducer,
      labels: labelsReducer,
      boards: boardsReducer,
      teams: teamsReducer,
   },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
