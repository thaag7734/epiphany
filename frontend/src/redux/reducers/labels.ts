import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type APIResponse, createAppAsyncThunk } from "@/redux/store";
import type { User, Label } from "@/types/Models";

export const getBoardLabels = createAppAsyncThunk(
	"labels/getBoardLabels",
	async (boardId: number, thunkAPI): Promise<APIResponse<Label>> => {
		return {
			id: 1,
			board_id: 1,
			name: "test",
		} satisfies Label;
	},
);

interface LabelsState {
	labels: { [key: string]: Label };
}

const initialState: LabelsState = {};

const labelsSlice = createSlice({
	name: "labels",
	initialState,
	reducers: {},
	extraReducers: (builder) => {},
});

export default labelsSlice.reducer;
