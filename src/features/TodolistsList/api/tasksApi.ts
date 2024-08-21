import { instance } from 'common/instance';
import { BaseResponse } from 'common/types';
import { AddTaskArg, GetTasksResponse, RemoveTaskArg, TaskData, UpdateTaskModel } from './tasksApi.types';

export const tasksApi = {
     getTasks(todolistId: string) {
          return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
     },
     deleteTask(arg: RemoveTaskArg) {
          return instance.delete<BaseResponse>(`todo-lists/${arg.todolistId}/tasks/${arg.taskId}`);
     },
     createTask(arg: AddTaskArg) {
          return instance.post<
               BaseResponse<{
                    item: TaskData
               }>
          >(`todo-lists/${arg.todolistId}/tasks`, { title: arg.title });
     },
     updateTask(todolistId: string, taskId: string, model: UpdateTaskModel) {
          return instance.put<BaseResponse<TaskData>>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
     }
};
