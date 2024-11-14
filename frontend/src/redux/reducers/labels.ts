import {
  createSelector,
  createSlice,
  isAnyOf,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../hooks";
import type { LabelCollection } from "../../types/Api";
import type { Label } from "../../types/Models";
import type { LabelFormData } from "../../types/FormData";

const PREFIX = "labels";

const GET_BOARD_LABELS = `${PREFIX}/getBoardLabels`;
const UPDATE_LABEL = `${PREFIX}/updateLabel`;
const CREATE_LABEL = `${PREFIX}/createLabel`;
const DELETE_LABEL = `${PREFIX}/deleteLabel`;

export const getBoardLabels = createAppAsyncThunk(
  GET_BOARD_LABELS,
  async (boardId: number, { fulfillWithValue, rejectWithValue }) => {
    const res = await fetch(`/api/boards/${boardId}/labels`);

    const data = await res.json();

    if (!res.ok) {
      return rejectWithValue(data);
    }

    return fulfillWithValue(data);
  },
);

export const updateLabel = createAppAsyncThunk(
  UPDATE_LABEL,
  async (form: LabelFormData, { fulfillWithValue, rejectWithValue }) => {
    const res = await fetch(`/api/labels/${form.id}/edit`, {
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

export const createLabel = createAppAsyncThunk(
  CREATE_LABEL,
  async (form: LabelFormData, { fulfillWithValue, rejectWithValue }) => {
    const res = await fetch(`/api/boards/${form.board_id}/new_label`, {
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

export const deleteLabel = createAppAsyncThunk(
  DELETE_LABEL,
  async (labelId: number, { fulfillWithValue, rejectWithValue }) => {
    const res = await fetch(`/api/labels/${labelId}/delete`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      rejectWithValue(data);
    }

    data.labelId = labelId;

    return fulfillWithValue(data);
  },
);

export const selectLabelById = createSelector(
  [(state) => state.labels, (_state, labelId: number) => labelId],
  (labels: LabelsState, labelId: number) =>
    Object.values(labels).find((l) => l.id === labelId),
);

export interface LabelsState {
  [key: string]: Label;
}

const initialState: LabelsState = {};

const setLabel = (
  state: LabelsState,
  action: PayloadAction<{ message: string; label: Label }>,
): void => {
  state[action.payload.label.id] = action.payload.label;
};

export const labelsSlice = createSlice({
  name: "labels",
  initialState,
  reducers: {
    clearState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBoardLabels.fulfilled, (state: LabelsState, action) => {
        const labels: Label[] = (action.payload as LabelCollection).labels;

        for (const label of labels) {
          state[label.id] = label;
        }
      })
      .addCase(deleteLabel.fulfilled, (state: LabelsState, action) => {
        delete state[
          (action.payload as { message: string; labelId: number }).labelId
        ];
      });
    builder.addMatcher(
      (action) => isAnyOf(createLabel.fulfilled, updateLabel.fulfilled)(action),
      setLabel,
    );
  },
});
