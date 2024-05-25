import axios from "axios";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '72046884-8665-4f22-8638-ad799be78564'
    }
})

type TodolistType = {
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
    }
}