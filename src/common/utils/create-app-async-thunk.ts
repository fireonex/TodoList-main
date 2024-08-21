import { AppDispatch, AppRootStateType } from "app/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { BaseResponse } from "../types";

/**
 * Utility function to create a typed version of createAsyncThunk specific to the application's Redux setup.
 *
 * @returns {void} - This function does not return a value.
 */
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootStateType;
  dispatch: AppDispatch;
  rejectValue: null | BaseResponse;
}>();
