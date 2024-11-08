import {
   createReducer,
   createAction,
   createAsyncThunk,
} from "@reduxjs/toolkit";

const LOGIN = "session/login";
const LOGOUT = "session/logout";

export type User = {
   id: number;
   username: string;
   email: string;
   root_board_id: number;
};

export const loginThunk = createAsyncThunk(
   LOGIN,
   async (credentials: { email: string; password: string }) => {
      const res = await fetch("/api/auth/login", {
         method: "POST",
      });
   }
);

const initialState: { user: User | null } = { user: null };
const login = createAction<User>(LOGIN);
const logout = createAction(LOGOUT);

const sessionReducer = createReducer(initialState, (builder) => {
   builder
      .addCase(login, (state, action) => {})
      .addCase(logout, (state, action) => {});
});

export default sessionReducer;
