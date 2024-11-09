import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type APIResponse, createAppAsyncThunk } from "@/redux/store";
import type { User, Label } from "@/types/Models";

interface LabelsState {
	labels: { [key: string]: Label };
}

const labelsSlice = createSlice({
	name: "labels",
	initialState,
	reducers: {},
	extraReducers: (builder) => {},
});

export default labelsSlice.reducer;
