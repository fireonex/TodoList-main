import { createAction } from '@reduxjs/toolkit';
import { TasksStateType } from 'features/TodolistsList/tasks-slice';
import { TodolistDomainType } from 'features/TodolistsList/todolists-slice';

export type ClearTasksAndTodosType = {
     tasks: TasksStateType;
     todolists: TodolistDomainType[];
};

export const clearTasksAndTodos = createAction<ClearTasksAndTodosType>(
     'common/clearTasksAndTodos',
);
