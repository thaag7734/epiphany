import { configureStore, createAsyncThunk } from "@reduxjs/toolkit";
import { sessionReducer, labelsReducer } from "./reducers/index"
//notesReducer,
//boardsReducer,
//teamsReducer,

export type ErrorResponse = { errors: { [key: string]: string } };
export type APIResponse<T> = T | ErrorResponse;

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    //notes: notesReducer,
    labels: labelsReducer,
    //boards: boardsReducer,
    //teams: teamsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: AppDispatch
  rejectValue: ErrorResponse
}>()
