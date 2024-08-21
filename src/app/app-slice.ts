import { authAPI } from 'api/todolists-api';
import { setIsLoggedInAC } from 'features/Login/auth-slice';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from 'app/store';

export const slice = createSlice({
     name: 'app',
     initialState: {
          status: 'idle' as RequestStatusType,
          error: null as string | null,
          isInitialized: false,
     },
     reducers: {
          setAppError: (
               state,
               action: PayloadAction<{ error: string | null }>,
          ) => {
               state.error = action.payload.error;
          },
          setAppStatus: (
               state,
               action: PayloadAction<{ status: RequestStatusType }>,
          ) => {
               state.status = action.payload.status;
          },
          setAppInitialized: (
               state,
               action: PayloadAction<{ isInitialized: boolean }>,
          ) => {
               state.isInitialized = action.payload.isInitialized;
          },
     },
     selectors: {
          selectStatus: (sliceState) => sliceState.status,
          //sliceState это стейт слайса, а не всего приложения
          selectIsInitialized: (sliceState) => sliceState.isInitialized,
          selectError: (sliceState) => sliceState.error,
     },
});

export const appReducer = slice.reducer;
export const { setAppError, setAppStatus, setAppInitialized } = slice.actions;

export const { selectStatus, selectIsInitialized, selectError } =
     slice.selectors;

export const appPath = slice.reducerPath;

export type AppInitialState = ReturnType<typeof slice.getInitialState>;

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';

// export type InitialStateType = {
//      // происходит ли сейчас взаимодействие с сервером
//      status: RequestStatusType;
//      // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
//      error: string | null;
//      // true когда приложение проинициализировалось (проверили юзера, настройки получили и т.д.)
//      isInitialized: boolean;
// };

export const initializeAppTC = (): AppThunk => (dispatch) => {
     authAPI.me().then((res) => {
          if (res.data.resultCode === 0) {
               dispatch(setIsLoggedInAC({ isLoggedIn: true }));
          } else {
          }

          dispatch(setAppInitialized({ isInitialized: true }));
     });
};
