import { createSlice, isAnyOf, type PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../hooks";
import type { NoteCollection } from "../../types/Api";
import type { Note } from "../../types/Models";
import type { NoteFormData } from "../../types/FormData";

const PREFIX = "notes";

const GET_BOARD_NOTES = `${PREFIX}/getBoardNotes`;
const UPDATE_NOTE = `${PREFIX}/updateNote`;
const CREATE_NOTE = `${PREFIX}/createNote`;
const DELETE_NOTE = `${PREFIX}/deleteNote`;

export const getBoardNotes = createAppAsyncThunk(
  GET_BOARD_NOTES,
  async (boardId: number, { fulfillWithValue, rejectWithValue }) => {
    const res = await fetch(`/api/boards/${boardId}/notes`);

    const data = await res.json();

    if (!res.ok) {
      return rejectWithValue(data);
    }

    return fulfillWithValue(data);
  },
);

export const updateNote = createAppAsyncThunk(
  UPDATE_NOTE,
  async (form: NoteFormData, { fulfillWithValue, rejectWithValue }) => {
    const res = await fetch(`/api/notes/${form.id}/edit`, {
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

export const createNote = createAppAsyncThunk(
  CREATE_NOTE,
  async (form: NoteFormData, { fulfillWithValue, rejectWithValue }) => {
    const res = await fetch(`/api/boards/${form.board_id}/new_note`, {
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

export const deleteNote = createAppAsyncThunk(
  DELETE_NOTE,
  async (noteId: number, { fulfillWithValue, rejectWithValue }) => {
    const res = await fetch(`/api/notes/${noteId}/delete`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      rejectWithValue(data);
    }

    data.noteId = noteId;

    return fulfillWithValue(data);
  },
);

export interface NotesState {
  [key: string]: Note;
}

const initialState: NotesState = {};

const setLabel = (
  state: NotesState,
  action: PayloadAction<{ message: string; note: Note }>,
): void => {
  state[action.payload.note.id] = action.payload.note;
};

export const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    clearState: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBoardNotes.fulfilled, (state: NotesState, action) => {
        const notes: Note[] = (action.payload as NoteCollection).notes;

        for (const note of notes) {
          state[note.id] = note;
        }
      })
      .addCase(deleteNote.fulfilled, (state: NotesState, action) => {
        delete state[
          (action.payload as { message: string; labelId: number }).labelId
        ];
      });
    builder.addMatcher(
      (action) => isAnyOf(createNote.fulfilled, updateNote.fulfilled)(action),
      setLabel,
    );
  },
});
