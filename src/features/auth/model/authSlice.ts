import { createSlice, isFulfilled, PayloadAction } from '@reduxjs/toolkit';
import { appActions } from 'app/model/appSlice';
import { clearTasksAndTodolists } from 'common/actions';
import { ResultCode } from 'common/enums';
import { createAppAsyncThunk, thunkTryCatch } from 'common/utils';
import { authAPI, LoginParams } from 'features/auth/api/authApi';
import { RejectAppError } from '../../../common/types';
import { getCaptchaUrlTC } from './securitySlice';

const slice = createSlice({
     name: 'auth',
     initialState: {
          isLoggedIn: false
     },
     reducers: {

     },
     extraReducers: (builder) => {
          builder.addMatcher(
               isFulfilled(login, logout, initializeApp),
               // isAnyOf(login.fulfilled, logout.fulfilled, initializeApp.fulfilled),
               (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
                    state.isLoggedIn = action.payload.isLoggedIn;
               }
          );
     },
     selectors: {
          selectIsLoggedIn: (state) => state.isLoggedIn
     }
});

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParams>(`${slice.name}/login`, (arg, thunkAPI) => {
     const { dispatch, rejectWithValue } = thunkAPI;
     return thunkTryCatch(thunkAPI, async () => {
          const res = await authAPI.login(arg);
          if (res.data.resultCode === ResultCode.Success) {
               return { isLoggedIn: true };
          } else if (res.data.resultCode === ResultCode.Captcha) {
               dispatch(getCaptchaUrlTC())
          }
          else {
               // const isShowAppError = !res.data.fieldsErrors.length
               // handleServerAppError(res.data, dispatch, isShowAppError)
               return rejectWithValue({ error: res.data, type: 'appError' } satisfies RejectAppError);
          }
     });
});

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, void>(`${slice.name}/logout`, (_, thunkAPI) => {
     const { dispatch, rejectWithValue } = thunkAPI;
     return thunkTryCatch(thunkAPI, async () => {
          const res = await authAPI.logout();
          if (res.data.resultCode === ResultCode.Success) {
               dispatch(clearTasksAndTodolists());
               return { isLoggedIn: false };
          } else {
               return rejectWithValue({ error: res.data, type: 'appError' } satisfies RejectAppError);
          }
     });
});

const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, void>(
     `${slice.name}/initializeApp`,
     (_, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI;
          return thunkTryCatch(thunkAPI, async () => {
               const res = await authAPI.me();
               if (res.data.resultCode === ResultCode.Success) {
                    return { isLoggedIn: true };
               } else {
                    return rejectWithValue({ error: res.data, type: 'appError' } satisfies RejectAppError);
               }
          }).finally(() => {
               dispatch(appActions.setAppInitialized({ isInitialized: true }));
          });
     }
);

export const authReducer = slice.reducer;
export const authThunks = { login, logout, initializeApp };
export const { selectIsLoggedIn } = slice.selectors;
export const authPath = slice.reducerPath;
