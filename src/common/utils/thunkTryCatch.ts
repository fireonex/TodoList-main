import { appActions } from "../../app/app.reducer";
import { handleServerNetworkError } from "./handle-server-network-error";
import { AppDispatch, AppRootStateType } from "../../app/store";
import { BaseThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { BaseResponse } from "../types";


type ThunkAPI = BaseThunkAPI<AppRootStateType, unknown, AppDispatch, null | BaseResponse>


/**
 * A utility function to handle try-catch logic for asynchronous thunks.
 *
 * @template T
 * @param {ThunkAPI} thunkAPI - The ThunkAPI object containing dispatch and rejectWithValue functions.
 * @param {() => Promise<T>} logic - The asynchronous logic to be executed within the try-catch block.
 * @returns {Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>>} - Returns the result of the logic execution or a rejection action.
 */

export const thunkTryCatch = async <T>(
  thunkAPI: ThunkAPI,
  logic: () => Promise<T>
): Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
  const { dispatch, rejectWithValue } = thunkAPI;
  dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    return await logic();
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  } finally {
    dispatch(appActions.setAppStatus({ status: "idle" }));
  }
};