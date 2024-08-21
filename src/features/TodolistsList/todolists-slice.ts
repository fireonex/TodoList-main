import { todolistsAPI, TodolistType } from 'api/todolists-api';
import { RequestStatusType, setAppStatus } from 'app/app-slice';
import { handleServerNetworkError } from 'utils/error-utils';
import { AppThunk } from 'app/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { clearTasksAndTodos } from 'common/actions/common.actions';

export const slice = createSlice({
     name: 'todolists',
     initialState: [] as Array<TodolistDomainType>,
     reducers: {
          removeTodolist: (state, action: PayloadAction<{ id: string }>) => {
               //return state.filter((tl) => tl.id != action.payload.id);
               const index = state.findIndex(
                    (tl) => tl.id === action.payload.id,
               );
               if (index !== -1) {
                    state.slice(index, 1);
               }
          },
          addTodolist: (
               state,
               action: PayloadAction<{ todolist: TodolistType }>,
          ) => {
               state.unshift({
                    ...action.payload.todolist,
                    filter: 'all',
                    entityStatus: 'idle',
               });
          },
          changeTodolistTitle: (
               state,
               action: PayloadAction<{ id: string; title: string }>,
          ) => {
               const index = state.findIndex(
                    (tl) => tl.id === action.payload.id,
               );
               if (index !== -1) {
                    state[index].title = action.payload.title;
               }
          },
          changeTodolistFilter: (
               state,
               action: PayloadAction<{ id: string; filter: FilterValuesType }>,
          ) => {
               const index = state.findIndex(
                    (tl) => tl.id === action.payload.id,
               );
               if (index !== -1) {
                    state[index].filter = action.payload.filter;
               }
          },
          changeTodolistEntityStatus: (
               state,
               action: PayloadAction<{ id: string; status: RequestStatusType }>,
          ) => {
               const index = state.findIndex(
                    (tl) => tl.id === action.payload.id,
               );
               if (index !== -1) {
                    state[index].entityStatus = action.payload.status;
               }
          },
          setTodolists: (
               state,
               action: PayloadAction<{ todolists: Array<TodolistType> }>,
          ) => {
               action.payload.todolists.forEach((tl) => {
                    state.push({ ...tl, filter: 'all', entityStatus: 'idle' });
               });
          },
          // clearTodolistsData: () => {
          //      return [];
          // },
     },
     extraReducers: (builder) => {
          builder.addCase(clearTasksAndTodos, (state, action) => {
               return action.payload.todolists;
          });
     },
     selectors: {
          selectTodolists: (sliceState) => sliceState,
     },
});

export const todolistsReducer = slice.reducer;
export const {
     removeTodolist,
     addTodolist,
     changeTodolistTitle,
     changeTodolistFilter,
     changeTodolistEntityStatus,
     setTodolists,
     //clearTodolistsData,
} = slice.actions;

export const { selectTodolists } = slice.selectors;

// thunks
export const fetchTodolistsTC = (): AppThunk => {
     return (dispatch) => {
          dispatch(setAppStatus({ status: 'loading' }));
          todolistsAPI
               .getTodolists()
               .then((res) => {
                    dispatch(setTodolists({ todolists: res.data }));
                    dispatch(setAppStatus({ status: 'succeeded' }));
               })
               .catch((error) => {
                    handleServerNetworkError(error, dispatch);
               });
     };
};
export const removeTodolistTC = (todolistId: string): AppThunk => {
     return (dispatch) => {
          //изменим глобальный статус приложения, чтобы вверху полоса побежала
          dispatch(setAppStatus({ status: 'loading' }));
          //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
          dispatch(
               changeTodolistEntityStatus({
                    id: todolistId,
                    status: 'loading',
               }),
          );
          todolistsAPI.deleteTodolist(todolistId).then((res) => {
               dispatch(removeTodolist({ id: todolistId }));
               //скажем глобально приложению, что асинхронная операция завершена
               dispatch(setAppStatus({ status: 'succeeded' }));
          });
     };
};
export const addTodolistTC = (title: string): AppThunk => {
     return (dispatch) => {
          dispatch(setAppStatus({ status: 'loading' }));
          todolistsAPI.createTodolist(title).then((res) => {
               dispatch(addTodolist({ todolist: res.data.data.item }));
               dispatch(setAppStatus({ status: 'succeeded' }));
          });
     };
};
export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
     return (dispatch) => {
          todolistsAPI.updateTodolist(id, title).then((res) => {
               dispatch(changeTodolistTitle({ id, title }));
          });
     };
};

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
     filter: FilterValuesType;
     entityStatus: RequestStatusType;
};
