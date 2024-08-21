import { Delete } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { EditableSpan } from 'common/components';
import { useAppDispatch } from 'common/hooks';
import React from 'react';
import { TodolistDomain, todolistsThunks } from '../../../model/todolistsSlice';

type Props = {
     todolist: TodolistDomain
}

export const TodolistTitle = ({ todolist }: Props) => {
     const { id, title, entityStatus } = todolist;
     const dispatch = useAppDispatch();

     const removeTodolistHandler = () => {
          dispatch(todolistsThunks.removeTodolist(id));
     };

     const changeTodolistTitleHandler = (title: string) => {
          dispatch(todolistsThunks.changeTodolistTitle({ id, title }));
     };

     return (
          <h3>
               <EditableSpan value={title} onChange={changeTodolistTitleHandler} />
               <IconButton onClick={removeTodolistHandler} disabled={entityStatus === 'loading'}>
                    <Delete />
               </IconButton>
          </h3>
     );
};
