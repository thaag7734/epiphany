import { createSlice, isAnyOf, type PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../hooks";
import type { TeamFormData } from "../../types/FormData";
import { Team } from "../../types/Models";

const PREFIX = "teams";

const UPDATE_TEAM = `${PREFIX}/updateTeam`;
const CREATE_TEAM = `${PREFIX}/createTeam`;
const DELETE_TEAM = `${PREFIX}/deleteTeam`;

export const updateTeam = createAppAsyncThunk(
  UPDATE_TEAM,
  async (form: TeamFormData, { fulfillWithValue, rejectWithValue }) => {
    const res = await fetch(`/api/teams/${form.team_id}/users`, {
      method: "PUT",
      body: JSON.stringify({
        users: form.emails,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      return rejectWithValue(data);
    }

    return fulfillWithValue(data);
  },
);

export const createTeam = createAppAsyncThunk(
  CREATE_TEAM,
  async (form: TeamFormData, { fulfillWithValue, rejectWithValue }) => {
    const res = await fetch(`/api/boards/${form.board_id}/new_team`, {
      method: "POST",
      body: JSON.stringify({
        users: form.emails,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      return rejectWithValue(data);
    }

    return fulfillWithValue(data);
  },
);

export const deleteTeam = createAppAsyncThunk(
  DELETE_TEAM,
  async (teamId: number, { fulfillWithValue, rejectWithValue }) => {
    const res = await fetch(`/api/teams/${teamId}`, { method: "DELETE" });

    const data = await res.json();

    if (!res.ok) {
      return rejectWithValue(data);
    }

    data.teamId = teamId;

    return fulfillWithValue(data);
  },
);

export type TeamState = Team | null;

const initialState: TeamState = null;

const setTeam = (
  state: TeamState,
  action: PayloadAction<{ message: string; team: Team }>,
): void => {
  state = action.payload.team;
};

export const teamSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    clearState: (state) => {
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(deleteTeam.fulfilled, (state: TeamState, action) => {
      state = action.payload.team;
    });
    builder.addMatcher(
      (action) => isAnyOf(createTeam.fulfilled, updateTeam.fulfilled)(action),
      setTeam,
    );
  },
});
