import { setAppStatus } from 'app/app-slice';
import { authAPI, LoginParamsType } from 'api/todolists-api';
import {
     handleServerAppError,
     handleServerNetworkError,
} from 'utils/error-utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from 'app/store';
import { clearTasksAndTodos } from 'common/actions/common.actions';

// const initialState: InitialStateType = {
//
// };

const slice = createSlice({
     name: 'auth',
     initialState: {
          isLoggedIn: false,
     },
     reducers: {
          setIsLoggedInAC: (
               state,
               action: PayloadAction<{ isLoggedIn: boolean }>,
          ) => {
               //return { ...state, isLoggedIn: action.payload.isLoggedIn };
               state.isLoggedIn = action.payload.isLoggedIn;
          },
     },
     selectors: {
          selectIsLoggedIn: (sliceState) => sliceState.isLoggedIn,
     },
});

export const authReducer = slice.reducer;
export const { setIsLoggedInAC } = slice.actions;

export const { selectIsLoggedIn } = slice.selectors;

// export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
//      switch (action.type) {
//           case "login/SET-IS-LOGGED-IN":
//                return { ...state, isLoggedIn: action.value };
//           default:
//                return state;
//      }
// };

// actions

//export const setIsLoggedInAC = (value: boolean) => ({ type: "login/SET-IS-LOGGED-IN", value }) as const;

// thunks
export const loginTC =
     (data: LoginParamsType): AppThunk =>
     (dispatch) => {
          dispatch(setAppStatus({ status: 'loading' }));
          authAPI
               .login(data)
               .then((res) => {
                    if (res.data.resultCode === 0) {
                         dispatch(setIsLoggedInAC({ isLoggedIn: true }));
                         dispatch(setAppStatus({ status: 'succeeded' }));
                    } else {
                         handleServerAppError(res.data, dispatch);
                    }
               })
               .catch((error) => {
                    handleServerNetworkError(error, dispatch);
               });
     };
export const logoutTC = (): AppThunk => (dispatch) => {
     dispatch(setAppStatus({ status: 'loading' }));
     authAPI
          .logout()
          .then((res) => {
               if (res.data.resultCode === 0) {
                    dispatch(setIsLoggedInAC({ isLoggedIn: false }));
                    dispatch(setAppStatus({ status: 'succeeded' }));
                    dispatch(clearTasksAndTodos({ tasks: {}, todolists: [] }));
               } else {
                    handleServerAppError(res.data, dispatch);
               }
          })
          .catch((error) => {
               handleServerNetworkError(error, dispatch);
          });
};

// types

type ActionsType = ReturnType<typeof setIsLoggedInAC>;
// type InitialStateType = {
//      isLoggedIn: boolean;
// };

//type ThunkDispatch = Dispatch<ActionsType | SetAppStatusActionType | SetAppErrorActionType>;
