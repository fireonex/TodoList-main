import { instance } from 'common/instance';
import { BaseResponse } from 'common/types';
import { Todolist, UpdateTodolistTitleArg } from './todolistsApi.types';

export const todolistsApi = {
     getTodolists() {
          return instance.get<Todolist[]>('todo-lists');
     },
     createTodolist(title: string) {
          return instance.post<BaseResponse<{ item: Todolist }>>('todo-lists', { title });
     },
     deleteTodolist(id: string) {
          return instance.delete<BaseResponse>(`todo-lists/${id}`);
     },
     updateTodolist(arg: UpdateTodolistTitleArg) {
          return instance.put<BaseResponse>(`todo-lists/${arg.id}`, { title: arg.title });
     }
};
