import {v1} from "uuid";
import {FilterValuesType, TodolistType} from "../App";

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST'
    payload: { id: string }
}

export type AddTodolistActionType =
    {
        type: 'ADD-TODOLIST'
        payload:
            { title: string }
    }

export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE'
    payload:
        {
            id: string
            title: string
        }
}

export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER'
    payload: {
        id: string
        filter: FilterValuesType
    }
}

type ActionsType = RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType


let todolistID1 = v1()
let todolistID2 = v1()


const initialState: TodolistType[] = [
    {id: todolistID1, title: 'What to learn', filter: 'all'},
    {id: todolistID2, title: 'What to buy', filter: 'all'},
]

export const todolistsReducer = (state = initialState, action: ActionsType): TodolistType[] => {

    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.payload.id) // логика по удалению тудулиста
        }
        case 'ADD-TODOLIST': {
            return [...state, {id: v1(), title: action.payload.title, filter: 'all'}] // логика по добавлению тудулиста
        }

        case 'CHANGE-TODOLIST-TITLE': {
            return state.map(tl => tl.id === action.payload.id ? {...tl, title: action.payload.title} : tl)
        }

        case 'CHANGE-TODOLIST-FILTER': {
            return state.map(tl =>
                tl.id === action.payload.id ? {...tl, filter: action.payload.filter} : tl
            )
        }

        default:
            throw new Error("I don't understand this type")
    }
}

export const removeTodolistAC = (id: string) => {
    return {
        type: 'REMOVE-TODOLIST',
        payload: {
            id: id,
        },
    } as const;
}

export const addTodolistAC = (title: string) => {
    return {
        type: 'ADD-TODOLIST',
        payload: {
            title: title,
        },
    } as const
}

export const updateTodolistAC = (id: string, title: string) => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        payload: {
            id: id,
            title: title,
        },
    } as const
}

export const changeFilterAC = (id: string, filter: FilterValuesType) => {
    return {
        type: 'CHANGE-TODOLIST-FILTER',
        payload: {
            id: id,
            filter: filter,
        },
    } as const
}