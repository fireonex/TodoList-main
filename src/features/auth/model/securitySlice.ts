import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { securityAPI } from '../api/securityAPI';
import { createAppAsyncThunk, thunkTryCatch } from '../../../common/utils';

const slice = createSlice({
     name: 'security',
     initialState: {
          captchaURL: ''
     },
     reducers: {
          setCaptchaUrl: (state, action: PayloadAction<{ url: string }>) => {
               state.captchaURL = action.payload.url;
          }
     }
});

export const { setCaptchaUrl } = slice.actions;

export const getCaptchaUrlTC = createAppAsyncThunk<{}>(`${slice.name}/captcha`, (_, thunkAPI) => {
     const { dispatch, rejectWithValue } = thunkAPI;
     return thunkTryCatch(thunkAPI, async () => {
          const res = await securityAPI.getCaptchaUrl();
          const captchaURL = res.data.url;
          dispatch(setCaptchaUrl({ url: captchaURL }));
     });
});

export const securityPath = slice.reducerPath;
export const securityReducer = slice.reducer;
