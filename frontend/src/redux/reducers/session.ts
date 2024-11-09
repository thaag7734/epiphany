import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type APIResponse, createAppAsyncThunk } from "../store";
import type { User } from "../../types/Models";

const LOGIN = "session/login";
const LOGOUT = "session/logout";
const SIGNUP = "session/signup";

export const login = createAppAsyncThunk(
	LOGIN,
	async (
		credentials: { email: string; password: string },
		thunkAPI,
	): Promise<APIResponse<User>> => {
		const res = await fetch("/api/auth/login", {
			method: "POST",
			body: JSON.stringify(credentials),
			headers: { "Content-Type": "application/json" },
		});

		const data = await res.json();

		if (!res.ok) {
			thunkAPI.rejectWithValue(data);
		}

		return new data();
	},
);

export const logout = createAppAsyncThunk(LOGOUT, async (): Promise<void> => {
	await fetch("/api/auth/logout");

	return;
});

export const signup = createAppAsyncThunk(
	SIGNUP,
	async (user: User, thunkAPI): Promise<User> => {
		const res = await fetch("/api/auth/signup", {
			method: "POST",
			body: JSON.stringify(user),
			headers: { "Content-Type": "application/json" },
		});

		const data = await res.json();

		if (!res.ok) {
			thunkAPI.rejectWithValue(data);
		}

		return data;
	},
);

interface SessionState {
	user: User | null;
}

const initialState: SessionState = { user: null };

const setUser = (state: SessionState, user: User | null): void => {
	state.user = user;
};

const sessionSlice = createSlice({
	name: "session",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(
				login.fulfilled,
				(state, action: PayloadAction<APIResponse<User>>) => {
					setUser(state, action.payload as User);
				},
			)
			.addCase(
				login.rejected,
				(state /*, action: PayloadAction<APIResponse<User>>*/) => {
					// we can do something with the ErrorResponse here if we need to
					setUser(state, null);
				},
			)
			.addCase(logout.fulfilled, (state) => {
				setUser(state, null);
			})
			.addCase(
				signup.fulfilled,
				(state, action: PayloadAction<APIResponse<User>>) => {
					setUser(state, action.payload as User);
				},
			);
	},
});

export default sessionSlice.reducer;
