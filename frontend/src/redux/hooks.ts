import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";
import type { ErrorResponse } from "../types/Api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: ErrorResponse;
}>();
