import React from 'react';
import { TaskStatuses } from 'common/enums';
import { TaskData } from '../../../api/tasksApi.types';
import { TodolistDomain } from '../../../model/todolistsSlice';
import { Task } from './Task/Task';


type Props = {
     tasks: TaskData[]
     todolist: TodolistDomain
}

export const Tasks = ({ tasks, todolist }: Props) => {
     let tasksForTodolist = tasks;

     if (todolist.filter === 'active') {
          tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New);
     }

     if (todolist.filter === 'completed') {
          tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed);
     }

     return (
          <>
               {tasksForTodolist.map((t) => (
                    <Task key={t.id} task={t} />
               ))}
          </>
     );
};
