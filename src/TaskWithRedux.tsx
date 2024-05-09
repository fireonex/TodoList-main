

//tod: добавить store (useSelector, dispatch) к Task (в компоненте (создать её) TaskWithRedux, на примере TodolistWithRedux)

import React, {ChangeEvent, memo} from "react";
import {Checkbox, IconButton} from "@mui/material";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@mui/icons-material";
import {TaskType} from "./Todolist";
import {useDispatch} from "react-redux";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";


export type TaskPropsType = {
    task: TaskType
    id: string
}


export const TaskWithRedux = memo((
    {task, id}: TaskPropsType) => {

    //const tasks = useSelector<AppRootStateType, TaskType[]>(state => state.tasks[id])
    //const {id, title, isDone} = task
    const dispatch = useDispatch();


    const onClickHandler = () => dispatch(removeTaskAC(task.id, id))


    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(changeTaskStatusAC(task.id, e.currentTarget.checked, id))
    }
    const onTitleChangeHandler = (newValue: string) => {
        dispatch(changeTaskTitleAC(task.id, newValue, id))
    }

    return <div key={task.id} className={task.isDone ? "is-done" : ""}>
        <Checkbox
            checked={task.isDone}
            color="primary"
            onChange={onChangeHandler}
        />
        <EditableSpan value={task.title} onChange={onTitleChangeHandler}/>
        <IconButton onClick={onClickHandler}>
            <Delete/>
        </IconButton>
    </div>
})


