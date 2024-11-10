import { createSlice, isAnyOf, type PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../hooks";
import type { User } from "../../types/Models";
import { getBoardNotes, notesSlice } from "./notes";
import { getBoardLabels, labelsSlice } from "./labels";

const LOGIN = "session/login";
const LOGOUT = "session/logout";
const SIGNUP = "session/signup";

export const login = createAppAsyncThunk(
  LOGIN,
  async (
    credentials: { email: string; password: string },
    { fulfillWithValue, rejectWithValue },
  ) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      return rejectWithValue(data);
    }

    return fulfillWithValue(data);
  },
);

export const logout = createAppAsyncThunk(LOGOUT, async () => {
  await fetch("/api/auth/logout");

  return;
});

export const signup = createAppAsyncThunk(
  SIGNUP,
  async (user: User, { fulfillWithValue, rejectWithValue }) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(user),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      return rejectWithValue(data);
    }

    return fulfillWithValue(data);
  },
);

interface SessionState {
  user: User | null;
  currentBoardId?: number;
}

const initialState: SessionState = { user: null};

const setUser = (state: SessionState, user: User | null): void => {
  state.user = user;
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    changeBoard: (state: SessionState, action: PayloadAction<number>) => {
      state.currentBoardId = action.payload
      notesSlice.actions.clearState();
      labelsSlice.actions.clearState();
      getBoardNotes(action.payload)
      getBoardLabels(action.payload)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled, (state: SessionState) => {
        setUser(state, null);
      })
      .addMatcher(
        (action) => isAnyOf(login.fulfilled, signup.fulfilled)(action),
        (state, action: PayloadAction<User>) => {
          setUser(state, action.payload);
        },
      );
  },
});
