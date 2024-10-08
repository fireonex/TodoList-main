import { createSlice } from '@reduxjs/toolkit';
import { clearTasksAndTodolists } from 'common/actions';
import { ResultCode, TaskPriorities, TaskStatuses } from 'common/enums';
import { createAppAsyncThunk, thunkTryCatch } from 'common/utils';
import { RejectAppError } from '../../../common/types';
import { tasksApi } from '../api/tasksApi';
import {
     AddTaskArg,
     RemoveTaskArg,
     TaskData,
     UpdateTaskArg,
     UpdateTaskModel
} from '../api/tasksApi.types';
import { todolistsThunks } from './todolistsSlice';

const slice = createSlice({
     name: 'tasks',
     initialState: {} as TasksState,
     reducers: {},
     extraReducers: (builder) => {
          builder
               .addCase(fetchTasks.fulfilled, (state, action) => {
                    state[action.payload.todolistId] = action.payload.tasks;
               })
               .addCase(addTask.fulfilled, (state, action) => {
                    const tasks = state[action.payload.task.todoListId];
                    tasks.unshift(action.payload.task);
               })
               .addCase(updateTask.fulfilled, (state, action) => {
                    const tasks = state[action.payload.todolistId];
                    const index = tasks.findIndex((t) => t.id === action.payload.taskId);
                    if (index !== -1) {
                         tasks[index] = { ...tasks[index], ...action.payload.domainModel };
                    }
               })
               .addCase(removeTask.fulfilled, (state, action) => {
                    const tasks = state[action.payload.todolistId];
                    const index = tasks.findIndex((t) => t.id === action.payload.taskId);
                    if (index !== -1) tasks.splice(index, 1);
               })
               .addCase(todolistsThunks.addTodolist.fulfilled, (state, action) => {
                    state[action.payload.todolist.id] = [];
               })
               .addCase(todolistsThunks.removeTodolist.fulfilled, (state, action) => {
                    delete state[action.payload.id];
               })
               .addCase(todolistsThunks.fetchTodolists.fulfilled, (state, action) => {
                    action.payload.todolists.forEach((tl) => {
                         state[tl.id] = [];
                    });
               })
               .addCase(clearTasksAndTodolists, () => {
                    return {};
               });
     },
     selectors: {
          selectTasks: (state) => state
     }
});

const fetchTasks = createAppAsyncThunk<{ tasks: TaskData[]; todolistId: string }, string>(
     `${slice.name}/fetchTasks`,
     (todolistId, thunkAPI) => {
          return thunkTryCatch(thunkAPI, async () => {
               const res = await tasksApi.getTasks(todolistId);
               const tasks = res.data.items;
               return { tasks, todolistId };
          });
     }
);

const addTask = createAppAsyncThunk<{ task: TaskData }, AddTaskArg>(`${slice.name}/addTask`, (arg, thunkAPI) => {
     const { dispatch, rejectWithValue } = thunkAPI;
     return thunkTryCatch(thunkAPI, async () => {
          const res = await tasksApi.createTask(arg);
          if (res.data.resultCode === ResultCode.Success) {
               const task = res.data.data.item;
               return { task };
          } else {
               return rejectWithValue({ error: res.data, type: 'appError' } satisfies RejectAppError);
          }
     });
});

const updateTask = createAppAsyncThunk<UpdateTaskArg, UpdateTaskArg>(
     `${slice.name}/updateTask`,
     (arg, thunkAPI) => {
          const { dispatch, rejectWithValue, getState } = thunkAPI;
          return thunkTryCatch(thunkAPI, async () => {
               const state = getState();
               const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId);
               if (!task) {
                    return;
               }

               const apiModel: UpdateTaskModel = {
                    deadline: task.deadline,
                    description: task.description,
                    priority: task.priority,
                    startDate: task.startDate,
                    title: task.title,
                    status: task.status,
                    ...arg.domainModel
               };

               const res = await tasksApi.updateTask(arg.todolistId, arg.taskId, apiModel);
               if (res.data.resultCode === ResultCode.Success) {
                    return arg;
               } else {
                    return rejectWithValue({ error: res.data, type: 'appError' } satisfies RejectAppError);
               }
          });
     }
);

const removeTask = createAppAsyncThunk<RemoveTaskArg, RemoveTaskArg>(
     `${slice.name}/removeTask`,
     (arg, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI;
          return thunkTryCatch(thunkAPI, async () => {
               const res = await tasksApi.deleteTask(arg);
               if (res.data.resultCode === ResultCode.Success) {
                    return arg;
               } else {
                    return rejectWithValue({ error: res.data, type: 'appError' } satisfies RejectAppError);
               }
          });
     }
);

export const tasksReducer = slice.reducer;
export const tasksThunks = { fetchTasks, addTask, updateTask, removeTask };
export const { selectTasks } = slice.selectors;
export const tasksPath = slice.reducerPath;

// types
export type UpdateDomainTaskModel = {
     title?: string
     description?: string
     status?: TaskStatuses
     priority?: TaskPriorities
     startDate?: string
     deadline?: string
}

export type TasksState = {
     [key: string]: Array<TaskData>
}
