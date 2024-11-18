import { createSlice, isAnyOf, type PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../hooks";
import type { User } from "../../types/Models";
import type { LoginFormData, SignupFormData } from "../../types/FormData";

const PREFIX = "session";

const LOGIN = `${PREFIX}/login`;
const LOGOUT = `${PREFIX}/logout`;
const SIGNUP = `${PREFIX}/signup`;
const RESTORE_USER = `${PREFIX}/restoreUser`;
const SET_ROOT_BOARD = `${PREFIX}/setRootBoard`;

export const login = createAppAsyncThunk(
  LOGIN,
  async (credentials: LoginFormData, { fulfillWithValue, rejectWithValue }) => {
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
  async (user: SignupFormData, { fulfillWithValue, rejectWithValue }) => {
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

export const restoreUser = createAppAsyncThunk(
  RESTORE_USER,
  async (_, { fulfillWithValue, rejectWithValue }) => {
    const res = await fetch("/api/auth", { credentials: "include" });

    const data = await res.json();

    if (!res.ok) {
      return rejectWithValue(data);
    }

    return fulfillWithValue(data);
  },
);

export const setRootBoard = createAppAsyncThunk(
  SET_ROOT_BOARD,
  async (boardId: number, { fulfillWithValue, rejectWithValue }) => {
    const res = await fetch("/api/users/boards/set_root", {
      method: "PUT",
      body: JSON.stringify({ board_id: boardId }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      return rejectWithValue(data);
    }

    data.boardId = boardId;
    return fulfillWithValue(data);
  },
);

export interface SessionState {
  user: User | null;
  currentBoardId?: number;
}

const initialState: SessionState = { user: null };

const setUser = (state: SessionState, user: User | null): void => {
  state.user = user;
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled, (state: SessionState) => {
        setUser(state, null);
        state.currentBoardId = undefined;
      })
      .addCase(setRootBoard.fulfilled, (state: SessionState, action) => {
        if (!state.user) return state;

        state.user.root_board_id = action.payload.boardId;
      })
      .addMatcher(
        (action) =>
          isAnyOf(
            login.fulfilled,
            signup.fulfilled,
            restoreUser.fulfilled,
          )(action),
        (state, action: PayloadAction<User>) => {
          setUser(state, action.payload);
        },
      );
  },
});
