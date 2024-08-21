import {
  TaskPriorities,
  TaskType,
  todolistsAPI,
  UpdateTaskArgs,
  UpdateTaskModelType
} from "api/todolists-api";
import { AppRootStateType, AppThunk } from "app/store";
import { appActions } from "app/app.reducer";
import { todolistsActions } from "features/TodolistsList/todolists.reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearTasksAndTodolists } from "common/actions/common.actions";
import { createAppAsyncThunk } from "../../common/utils/createAsyncThunk";
import { handleServerAppError } from "../../common/utils/handleServerAppError";
import { handleServerNetworkError } from "../../common/utils/handleServerNetworkError";
import { TaskStatuses } from "../../common/enum/enums";


const initialState: TasksStateType = {};

export type AddTaskArgs = { todolistId: string; title: string }


const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    removeTask: (
      state,
      action: PayloadAction<{ taskId: string; todolistId: string }>
    ) => {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex(
        (t) => t.id === action.payload.taskId
      );
      if (index !== -1) tasks.splice(index, 1);
    },
    // updateTask: (
    //   state,
    //   action: PayloadAction<{
    //     taskId: string;
    //     model: UpdateDomainTaskModelType;
    //     todolistId: string;
    //   }>
    // ) => {
    //   const tasks = state[action.payload.todolistId];
    //   const index = tasks.findIndex(
    //     (t) => t.id === action.payload.taskId
    //   );
    //   if (index !== -1) {
    //     tasks[index] = { ...tasks[index], ...action.payload.model };
    //   }
    // }
  },
  extraReducers: (builder) => {
    builder
      .addCase(todolistsActions.addTodolist, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(todolistsActions.removeTodolist, (state, action) => {
        delete state[action.payload.id];
      })
      .addCase(todolistsActions.setTodolists, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = [];
        });
      })
      .addCase(clearTasksAndTodolists, () => {
        return {};
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks;
      })
      .addCase(fetchTasks.rejected, (state, action) => {

      })
      .addCase(addTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.task.todoListId];
        tasks.unshift(action.payload.task);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId];
          const index = tasks.findIndex(
            (t) => t.id === action.payload.taskId
          );
          if (index !== -1) {
            tasks[index] = { ...tasks[index], ...action.payload.model };
          }
      })
  }
});


export const fetchTasks = createAppAsyncThunk<{
  tasks: TaskType[], todolistId: string
}, string>(
  // 1 - prefix
  `${slice.name}/fetchTasks`,
  // 2 - callback (условно наша старая санка), в которую:
  // Первым параметром мы передаем параметры необходимые для санки
  // (если параметров больше чем один упаковываем их в объект)
  // Вторым параметром thunkAPI, обратившись к которому получим dispatch ...
  async (todolistId, thunkAPI) => {
    // 3 - деструктурируем параметры именно так. В дальнейшем пригодится такая запись
    const { dispatch, rejectWithValue } = thunkAPI;

    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await todolistsAPI.getTasks(todolistId);
      const tasks = res.data.items;
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { tasks, todolistId };
    } catch (err: any) {
      handleServerNetworkError(err, dispatch);
      return rejectWithValue(null);
    }
  });


export const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArgs>(
  `${slice.name}/addTask`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    const { todolistId, title } = arg;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await todolistsAPI.createTask(todolistId, title);

      if (res.data.resultCode === 0) {
        const task = res.data.data.item;
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return { task };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error: any) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  }
);

export const updateTask = createAppAsyncThunk<
  UpdateTaskArgs,
  { taskId: string; domainModel: UpdateDomainTaskModelType; todolistId: string }
>(
  `${slice.name}/updateTask`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI;
    const { taskId, domainModel, todolistId } = arg;

    try {
      const state = getState() as AppRootStateType;
      const task = state.tasks[todolistId].find((t) => t.id === taskId);

      if (!task) {
        console.warn("task not found in the state");
        return rejectWithValue(null);
      }

      const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...domainModel
      };

      const res = await todolistsAPI.updateTask(todolistId, taskId, apiModel);

      if (res.data.resultCode === 0) {
        return {
            taskId,
            model: domainModel,
            todolistId
        }

      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error: any) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  }
);

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;


// thunks
export const removeTaskTC =
  (taskId: string, todolistId: string): AppThunk =>
    (dispatch) => {
      todolistsAPI.deleteTask(todolistId, taskId).then(() => {
        dispatch(tasksActions.removeTask({ taskId, todolistId }));
      });
    };


// types
export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
export type TasksStateType = {
  [key: string]: Array<TaskType>;
};
