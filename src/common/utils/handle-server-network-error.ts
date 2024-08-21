import { Dispatch } from "redux";
import axios, { AxiosError } from "axios";
import { appActions } from "app/app.reducer";

/**
 * This function checks if the error is an Axios error and dispatches the appropriate
 * actions to set the application error message and status. If the error is not an Axios error,
 * it handles it as a native error.
 *
 * @param {unknown} e - The error object that occurred during a network request.
 * @param {Dispatch} dispatch - The dispatch function from Redux to send actions to the store.
 *
 * @returns {void} - This function does not return a value.
 */

export const handleServerNetworkError = (e: unknown, dispatch: Dispatch) => {
  const err = e as Error | AxiosError<{ error: string }>;
  if (axios.isAxiosError(err)) {
    const error = err.message ? err.message : "Some error occurred";
    dispatch(appActions.setAppError({ error }));
  } else {
    dispatch(appActions.setAppError({ error: `Native error ${err.message}` }));
  }
  dispatch(appActions.setAppStatus({ status: "failed" }));
};
