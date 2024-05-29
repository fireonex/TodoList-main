import axios from "axios";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '72046884-8665-4f22-8638-ad799be78564'
    }
})

export type TodolistType = {
    addedDate: string;
    id: string;
    order: number;
    title: string;
}

type FieldErrorType = {
    error: string
    field: string
}

type ResponseType<T = {}> = {
    resultCode: number
    messages: string[]
    fieldsErrors: FieldErrorType[]
    data: T
}

export type TaskType = {
    description: string
    title: string
    completed: boolean
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}

type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
}

type UpdateTaskType = {
    title: string
    description: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}


export const todolistAPI = {
    getTodolists: () => {
        return instance.get<TodolistType[]>('todo-lists')
    },

    createTodolist(title: string) {
        return instance.post<ResponseType<{item: TodolistType}>>('todo-lists', {title})
    },

    deleteTodolist(todolistId: string) {
        return instance
            .delete<ResponseType>(`todo-lists/${todolistId}`)
    },

    updateTodolist(todolistId: string) {
        return instance
            .put<ResponseType>(`todo-lists/${todolistId}`,
                {title: 'MY FAV TODO'})
    },

    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
    },

    createTask (todolistId: string, title: string) {
        return instance.post<ResponseType>(`todo-lists/${todolistId}/tasks`, {title})
    },

    deleteTask (todolistId: string, taskId: string) {
        return instance.delete<ResponseType<TaskType>>(`/todo-lists/${todolistId}/tasks/${taskId}`)
    },

    updateTask (todolistId: string, taskId: string, title: string) {
        return instance.put<ResponseType>(`/todo-lists/${todolistId}/tasks/${taskId}`, {title})
    }
}