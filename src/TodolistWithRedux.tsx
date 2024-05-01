import React, {ChangeEvent} from 'react';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import IconButton from "@mui/material/IconButton/IconButton";
import {Delete} from "@mui/icons-material";
import {Button, Checkbox} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./store";
import {TodolistType} from "./AppWithRedux";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";
import {changeTodolistFilterAC, changeTodolistTitleAC, removeTodolistAC} from "./state/todolists-reducer";


export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    todolist: TodolistType
}

export function TodolistWithRedux({todolist}: PropsType) {

    const {id, filter, title} = todolist

    // let todolists = useSelector<AppRootStateType, TodolistType>(state =>
    //     state.todolists.filter(list => list.id === props.id)[0]
    // )

    let tasks = useSelector<AppRootStateType, TaskType[]>(state => state.tasks[id])

    let dispatch = useDispatch()

    const addTask = (title: string) => {
        dispatch(addTaskAC(title, id))
    }

    const removeTodolist = () => {
        dispatch(removeTodolistAC(id))
    }
    const changeTodolistTitle = (title: string) => {
        dispatch(changeTodolistTitleAC(id, title))
    }

    const onAllClickHandler = () => dispatch(changeTodolistFilterAC(id, "all"))
    const onActiveClickHandler = () => dispatch(changeTodolistFilterAC(id, "active"))
    const onCompletedClickHandler = () => dispatch(changeTodolistFilterAC( id, "completed"))


    return <div>
        <h3> <EditableSpan value={title} onChange={changeTodolistTitle} />
            <IconButton onClick={removeTodolist}>
                <Delete />
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <div>
            {
                tasks.map(t => {
                    const onClickHandler = () => dispatch(removeTaskAC(t.id, id))

                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        let newIsDoneValue = e.currentTarget.checked;
                        dispatch(changeTaskStatusAC(t.id, newIsDoneValue, id));
                    }
                    const onTitleChangeHandler = (newValue: string) => {
                        dispatch(changeTaskTitleAC(t.id, newValue, id));
                    }


                    return <div key={t.id} className={t.isDone ? "is-done" : ""}>
                        <Checkbox
                            checked={t.isDone}
                            color="primary"
                            onChange={onChangeHandler}
                        />

                        <EditableSpan value={t.title} onChange={onTitleChangeHandler} />
                        <IconButton onClick={onClickHandler}>
                            <Delete />
                        </IconButton>
                    </div>
                })
            }
        </div>
        <div>
            <Button variant={filter === 'all' ? 'outlined' : 'text'}
                    onClick={onAllClickHandler}
                    color={'inherit'}
            >All
            </Button>
            <Button variant={filter === 'active' ? 'outlined' : 'text'}
                    onClick={onActiveClickHandler}
                    color={'primary'}>Active
            </Button>
            <Button variant={filter === 'completed' ? 'outlined' : 'text'}
                    onClick={onCompletedClickHandler}
                    color={'secondary'}>Completed
            </Button>
        </div>
    </div>
}


