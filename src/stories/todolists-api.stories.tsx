import React, {useEffect, useState} from 'react'
import {todolistAPI} from "../api/api";

export default {
    title: 'API',
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {
        // здесь мы будем делать запрос и ответ закидывать в стейт.
        // который в виде строки будем отображать в div-ке

        const promise = todolistAPI.getTodolists()
        promise.then((res) => {
            setState(res.data)
        })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistAPI.createTodolist('MY TODO')
            .then((res) => setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)

    const todolistId = 'aa90a9fe-452b-4af9-8c9d-090bee447139'

    useEffect(() => {
        todolistAPI.deleteTodolist(todolistId)
            .then((res) => setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)

    const todolistId = '9aa004b9-e970-44e0-bcb1-569b7c220e81'

    useEffect(() => {
        todolistAPI.updateTodolist(todolistId)
            .then((res) => setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}


//----tasks--------------------------------------------------------------------//


export const GetTasks = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {
        const todolistId = '7416f276-9328-44c7-9c2e-6303854ce5da'
        todolistAPI.getTasks(todolistId).then((res) => {
            setState(res.data)
        })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '7416f276-9328-44c7-9c2e-6303854ce5da'
        todolistAPI.createTask(todolistId, 'MY SECOND TITLE')
            .then((res) => setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)

    const todolistId = '7416f276-9328-44c7-9c2e-6303854ce5da'
    const taskId = '3180fd52-cc41-47a1-9ba0-f562b833773f'
    useEffect(() => {
        todolistAPI.deleteTask(todolistId, taskId)
            .then((res) => setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const UpdateTaskTitle = () => {
    const [state, setState] = useState<any>(null)

    const todolistId = '7416f276-9328-44c7-9c2e-6303854ce5da'
    const taskId = '3180fd52-cc41-47a1-9ba0-f562b833773f'

    useEffect(() => {
        todolistAPI.updateTask(todolistId, taskId, 'MY UPDATED TITLE')
            .then((res) => setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
