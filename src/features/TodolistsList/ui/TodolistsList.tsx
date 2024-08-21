import { Grid, Paper } from '@mui/material';
import { AddItemForm } from 'common/components';
import { useAppDispatch } from 'common/hooks';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectIsLoggedIn } from '../../auth/model/authSlice';
import { selectTasks } from '../model/tasksSlice';
import { selectTodolists, todolistsThunks } from '../model/todolistsSlice';
import { Todolist } from './Todolist/Todolist';

export const TodolistsList = () => {
     const todolists = useSelector(selectTodolists);
     const tasks = useSelector(selectTasks);
     const isLoggedIn = useSelector(selectIsLoggedIn);

     const dispatch = useAppDispatch();

     useEffect(() => {
          if (!isLoggedIn) {
               return;
          }
          dispatch(todolistsThunks.fetchTodolists());
     }, []);

     const addTodolist = (title: string) => {
          return dispatch(todolistsThunks.addTodolist(title));
     };

     if (!isLoggedIn) {
          return <Navigate to={'/login'} />;
     }

     return (
          <>
               <Grid container style={{ padding: '20px' }}>
                    <AddItemForm addItem={addTodolist} />
               </Grid>
               <Grid container spacing={3}>
                    {todolists.map((tl) => {
                         let allTodolistTasks = tasks[tl.id];

                         return (
                              <Grid item key={tl.id}>
                                   <Paper style={{ padding: '10px' }}>
                                        <Todolist todolist={tl} tasks={allTodolistTasks} />
                                   </Paper>
                              </Grid>
                         );
                    })}
               </Grid>
          </>
     );
};
