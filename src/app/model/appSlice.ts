import { createSlice, isFulfilled, isPending, isRejected, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RejectActionError } from '../../common/types';

const slice = createSlice({
     name: 'app',
     initialState: {
          status: 'idle' as RequestStatusType,
          error: null as string | null,
          isInitialized: false
     },
     reducers: {
          setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
               state.error = action.payload.error;
          },
          setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
               state.status = action.payload.status;
          },
          setAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
               state.isInitialized = action.payload.isInitialized;
          }
     },
     extraReducers: (builder) => {
          builder
               .addMatcher(isPending, (state) => {
                    state.status = 'loading';
               })
               .addMatcher(isFulfilled, (state) => {
                    state.status = 'succeeded';
               })
               .addMatcher(isRejected, (state) => {
                    state.status = 'failed';
               })
               .addMatcher(
                    (action): action is PayloadAction<RejectActionError> => {
                         return isRejected(action) && action.payload;
                    },
                    (state, action: PayloadAction<RejectActionError>) => {
                         const defaultMessage = 'Some error occurred';

                         // if (action.type === todolistsThunks.addTodolist.fulfilled.type) return

                         switch (action.payload.type) {
                              case 'appError': {
                                   const error = action.payload.error;
                                   state.error = error.messages.length ? error.messages[0] : defaultMessage;
                                   break;
                              }

                              case 'catchError': {
                                   const error = action.payload.error;
                                   if (axios.isAxiosError(error)) {
                                        state.error = error.response?.data?.message || error?.message || defaultMessage;
                                   } else if (error instanceof Error) {
                                        state.error = `Native error: ${error.message}`;
                                   } else {
                                        state.error = JSON.stringify(error);
                                   }
                                   break;
                              }

                              default:
                                   state.error = defaultMessage;
                         }
                    }
               )
               .addDefaultCase((state, action) => {
                    console.log(action);
               });
     },
     selectors: {
          selectError: (state) => state.error,
          selectStatus: (state) => state.status,
          selectIsInitialized: (state) => state.isInitialized
     }
});

export const appReducer = slice.reducer;
export const appActions = slice.actions;
export const { selectError, selectStatus, selectIsInitialized } = slice.selectors;
export const appPath = slice.reducerPath;
export type AppInitialState = ReturnType<typeof slice.getInitialState>

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
