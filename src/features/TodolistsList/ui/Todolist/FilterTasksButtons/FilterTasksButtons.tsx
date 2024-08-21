import { Button } from '@mui/material';
import React from 'react';
import { useAppDispatch } from 'common/hooks';
import { FilterValues, TodolistDomain, todolistsActions } from '../../../model/todolistsSlice';

type Props = {
     todolist: TodolistDomain
}

export const FilterTasksButtons = ({ todolist }: Props) => {
     const { filter, id } = todolist;

     const dispatch = useAppDispatch();

     const filterTasksHandler = (filter: FilterValues) => {
          dispatch(todolistsActions.changeTodolistFilter({ id, filter }));
     };

     return (
          <>
               <Button
                    variant={filter === 'all' ? 'outlined' : 'text'}
                    onClick={() => filterTasksHandler('all')}
                    color={'inherit'}
               >
                    All
               </Button>
               <Button
                    variant={filter === 'active' ? 'outlined' : 'text'}
                    onClick={() => filterTasksHandler('active')}
                    color={'primary'}
               >
                    Active
               </Button>
               <Button
                    variant={filter === 'completed' ? 'outlined' : 'text'}
                    onClick={() => filterTasksHandler('completed')}
                    color={'secondary'}
               >
                    Completed
               </Button>
          </>
     );
};
