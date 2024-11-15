import {
  createSelector,
  createSlice,
  isAnyOf,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../hooks";
import type { BoardCollection } from "../../types/Api";
import type { Board } from "../../types/Models";
import type { BoardFormData } from "../../types/FormData";

const PREFIX = "boards";

const GET_BOARDS = `${PREFIX}/getBoards`;
const UPDATE_BOARD = `${PREFIX}/updateBoard`;
const CREATE_BOARD = `${PREFIX}/createBoard`;
const DELETE_BOARD = `${PREFIX}/deleteBoard`;

export const getBoards = createAppAsyncThunk(
  GET_BOARDS,
  async (_, { fulfillWithValue, rejectWithValue }) => {
    const res = await fetch("/api/users/boards");

    const data = await res.json();

    if (!res.ok) {
      return rejectWithValue(data);
    }

    return fulfillWithValue(data);
  },
);

export const updateBoard = createAppAsyncThunk(
  UPDATE_BOARD,
  async (form: BoardFormData, { fulfillWithValue, rejectWithValue }) => {
    const res = await fetch(`/api/board/${form.id}`, {
      method: "PUT",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      rejectWithValue(data);
    }

    return fulfillWithValue(data);
  },
);

export const createBoard = createAppAsyncThunk(
  CREATE_BOARD,
  async (form: BoardFormData, { fulfillWithValue, rejectWithValue }) => {
    const res = await fetch("/api/boards/new", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      rejectWithValue(data);
    }

    return fulfillWithValue(data);
  },
);

export const deleteBoard = createAppAsyncThunk(
  DELETE_BOARD,
  async (boardId: number, { fulfillWithValue, rejectWithValue }) => {
    const res = await fetch(`/api/boards/${boardId}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      rejectWithValue(data);
    }

    data.boardId = boardId;

    return fulfillWithValue(data);
  },
);

export const selectBoardById = createSelector(
  [(state) => state.boards, (_state, boardId: number) => boardId],
  (boards: BoardsState, boardId: number) =>
    Object.values(boards).find((b) => b.id === boardId),
);

export const selectAllBoards = createSelector(
  [(state) => state.boards],
  (boards: BoardsState) => Object.values(boards),
);

export interface BoardsState {
  [key: string]: Board;
}

const initialState: BoardsState = {};

const setBoard = (
  state: BoardsState,
  action: PayloadAction<{ message: string; board: Board }>,
): void => {
  state[action.payload.board.id] = action.payload.board;
};

export const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    clearState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBoards.fulfilled, (state: BoardsState, action) => {
        const boards: Board[] = (action.payload as BoardCollection).boards;

        for (const board of boards) {
          state[board.id] = board;
        }
      })
      .addCase(deleteBoard.fulfilled, (state: BoardsState, action) => {
        delete state[
          (action.payload as { message: string; boardId: number }).boardId
        ];
      });
    builder.addMatcher(
      (action) => isAnyOf(createBoard.fulfilled, updateBoard.fulfilled)(action),
      setBoard,
    );
  },
});
