import React, {memo, useCallback, useMemo} from 'react';
import {FilterValuesType} from './App';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import {IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {MyButton} from "./MyButton";
import {Task} from "./Task";
import {TaskWithRedux} from "./TaskWithRedux";


export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string, todolistId: string) => void
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (id: string, isDone: boolean, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    filter: FilterValuesType
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
}


export const Todolist = memo((props: PropsType) => {


    const addTask = useCallback((title: string) => {
        props.addTask(title, props.id);
    }, [props.addTask, props.id]);

    const removeTodolist = () => {
        props.removeTodolist(props.id);
    };

    const changeTodolistTitle = useCallback((title: string) => {
        props.changeTodolistTitle(props.id, title);
    }, [props.changeTodolistTitle, props.id]);

    const onAllClickHandler = useCallback(() => props.changeFilter("all", props.id), [props.changeFilter, props.id]);
    const onActiveClickHandler = useCallback(() => props.changeFilter("active", props.id), [props.changeFilter, props.id]);
    const onCompletedClickHandler = useCallback(() => props.changeFilter("completed", props.id), [props.changeFilter, props.id]);

    const filteredTasks = useMemo(() => {
        if (!props.tasks) return [];  // Добавлена проверка на существование tasks
        switch (props.filter) {
            case "active":
                return props.tasks.filter(t => !t.isDone);
            case "completed":
                return props.tasks.filter(t => t.isDone);
            default:
                return props.tasks;
        }
    }, [props.tasks, props.filter]);

    return <div>
        <h3>
            <EditableSpan value={props.title} onChange={changeTodolistTitle}/>
            <IconButton onClick={removeTodolist}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <div>
            {
                filteredTasks.length > 0 ? filteredTasks.map(t => (
                    <TaskWithRedux
                        id={props.id}
                        task={t}
                        // changeTaskTitle={props.changeTaskTitle}
                        // changeTaskStatus={props.changeTaskStatus}
                        // removeTask={props.removeTask}
                        key={t.id}
                    />
                )) : <p>No tasks to show</p>
            }
        </div>
        <div style={{paddingTop: "10px"}}>
            <MyButton variant={props.filter === 'all' ? 'outlined' : 'text'}
                      onClick={onAllClickHandler}
                      color={'inherit'}
                      title={'All'}>
            </MyButton>
            <MyButton variant={props.filter === 'active' ? 'outlined' : 'text'}
                      onClick={onActiveClickHandler}
                      color={'primary'}
                      title={'Active'}>
            </MyButton>
            <MyButton variant={props.filter === 'completed' ? 'outlined' : 'text'}
                      onClick={onCompletedClickHandler}
                      color={'secondary'}
                      title={'Completed'}>
            </MyButton>
        </div>
    </div>;
});
