import {TaskStatuses, TaskType} from "../../api/todolists-api";
import {useSelector} from "react-redux";
import {AppRootStateType, useAppDispatch} from "../../app/store";
import {
    addTodolistTC,
    changeTodolistFilterAC,
    FilterValuesType,
    getTodosTC,
    removeTodolistTC,
    TodolistDomainType,
    updateTodolistTitleTC
} from "./todolists-reducer";
import React, {useCallback, useEffect} from "react";
import {addTaskTC, removeTaskTC, updateTaskStatusTC, updateTaskTitleTC} from "./todolist/task/tasks-reducer";
import Grid from "@mui/material/Grid";
import {AddItemForm} from "../AddItemForm";
import Paper from "@mui/material/Paper";
import {Todolist} from "./todolist/Todolist";


export type TasksStateType = {
    [key: string]: Array<TaskType>
}

export const TodolistsList = () => {

    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const dispatch = useAppDispatch();

    // useEffect(() => {
    //     todolistsAPI.getTodolists()
    //         .then(res => {
    //             const action = setTodolistsAC(res.data);
    //             dispatch(action);
    //         });
    // }, []);

    useEffect(() => {
        dispatch(getTodosTC())
    }, [])


    const removeTask = useCallback(function (id: string, todolistId: string) {
        dispatch(removeTaskTC(todolistId, id))
    }, []);

    const addTask = useCallback(function (title: string, todolistId: string) {
        dispatch(addTaskTC(title, todolistId))
    }, []);

    const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
        dispatch(updateTaskStatusTC(todolistId, id, status))
    }, []);

    const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
        dispatch(updateTaskTitleTC(todolistId, id, newTitle))
    }, []);

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        const action = changeTodolistFilterAC(todolistId, value);
        dispatch(action);
    }, []);

    const removeTodolist = useCallback(function (id: string) {
        dispatch(removeTodolistTC(id))
    }, []);


    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        dispatch(updateTodolistTitleTC(id, title))
    }, []);


    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistTC(title))
    }, [dispatch]);


    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id];

                    return <Grid item key={tl.id}>
                        <Paper style={{padding: '10px'}}>
                            <Todolist
                                id={tl.id}
                                title={tl.title}
                                tasks={allTodolistTasks}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                changeTaskStatus={changeStatus}
                                filter={tl.filter}
                                removeTodolist={removeTodolist}
                                changeTaskTitle={changeTaskTitle}
                                changeTodolistTitle={changeTodolistTitle}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>

}