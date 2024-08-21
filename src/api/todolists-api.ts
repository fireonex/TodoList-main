import axios from "axios";
import { UpdateDomainTaskModelType } from "../features/TodolistsList/tasks.reducer";
import { TaskPriorities, TaskStatuses } from "../common/enum/enums";

export const settings = {
     withCredentials: true,
     headers: {
          'API-KEY': '72046884-8665-4f22-8638-ad799be78564',
     },
};
export const instance = axios.create({
     baseURL: 'https://social-network.samuraijs.com/api/1.1/',
     ...settings,
});

// api
export const todolistsAPI = {
     getTodolists() {
          const promise = instance.get<TodolistType[]>('todo-lists');
          return promise;
     },
     createTodolist(title: string) {
          const promise = instance.post<ResponseType<{ item: TodolistType }>>(
               'todo-lists',
               { title: title },
          );
          return promise;
     },
     deleteTodolist(id: string) {
          const promise = instance.delete<ResponseType>(`todo-lists/${id}`);
          return promise;
     },
     updateTodolist(id: string, title: string) {
          const promise = instance.put<ResponseType>(`todo-lists/${id}`, {
               title: title,
          });
          return promise;
     },
     getTasks(todolistId: string) {
          return instance.get<GetTasksResponse>(
               `todo-lists/${todolistId}/tasks`,
          );
     },
     deleteTask(todolistId: string, taskId: string) {
          return instance.delete<ResponseType>(
               `todo-lists/${todolistId}/tasks/${taskId}`,
          );
     },
     createTask(todolistId: string, taskTitile: string) {
          return instance.post<ResponseType<{ item: TaskType }>>(
               `todo-lists/${todolistId}/tasks`,
               { title: taskTitile },
          );
     },
     updateTask(
          todolistId: string,
          taskId: string,
          model: UpdateTaskModelType,
     ) {
          return instance.put<ResponseType<TaskType>>(
               `todo-lists/${todolistId}/tasks/${taskId}`,
               model,
          );
     },
};

export type LoginParamsType = {
     email: string;
     password: string;
     rememberMe: boolean;
     captcha?: string;
};



// types

export type UpdateTaskArgs = { taskId: string; model: UpdateDomainTaskModelType; todolistId: string }

export type TodolistType = {
     id: string;
     title: string;
     addedDate: string;
     order: number;
};


export type TaskType = {
     description: string;
     title: string;
     status: TaskStatuses;
     priority: TaskPriorities;
     startDate: string;
     deadline: string;
     id: string;
     todoListId: string;
     order: number;
     addedDate: string;
};
export type UpdateTaskModelType = {
     title: string;
     description: string;
     status: TaskStatuses;
     priority: TaskPriorities;
     startDate: string;
     deadline: string;
};
type GetTasksResponse = {
     error: string | null;
     totalCount: number;
     items: TaskType[];
};
