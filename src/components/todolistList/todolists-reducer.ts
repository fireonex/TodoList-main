import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {Dispatch} from "redux";


// types-------------------------------------------------------------------//
type ActionsType = ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof setTodolistsAC>

const initialState: Array<TodolistDomainType> = [
    /*{id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
    {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}*/
]

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': return state.filter(tl => tl.id !== action.id)

        case 'ADD-TODOLIST': return [{...action.todolist, filter: "active"}, ...state]

        case 'CHANGE-TODOLIST-TITLE': {
            return state.map(tl =>
                tl.id === action.id ? { ...tl, title: action.title } : tl
            );
        }
        case 'CHANGE-TODOLIST-FILTER': {
            return state.map(tl =>
                tl.id === action.id ? { ...tl, filter: action.filter } : tl
            );
        }

        case 'SET-TODOLISTS': {
            return action.todolists.map((tl) => ({...tl, filter: 'all'}))
        }
        default:
            return state;
    }
}

//actions-------------------------------------------------------------------------------------------------------------//
export const removeTodolistAC = (todolistId: string) => ({type: 'REMOVE-TODOLIST', id: todolistId} as const)
export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTodolistTitleAC = (id: string, title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    id: id,
    title: title
} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    id: id,
    filter: filter
} as const)
export const setTodolistsAC = (todolists: TodolistType[]) => ({type: 'SET-TODOLISTS', todolists} as const)


//thunks--------------------------------------------------------------------------------------------------------------//

// const getTodos = (dispatch, getState) => {
//     // внутри санки можно делать побочные эффекты (запросы на сервер)
//     todolistsAPI.getTodolists().then(res => {
//         // и диспатчить экшены (action) или другие санки (thunk)
//         dispatch(setTodolistsAC(res))
//     })
// }

export const getTodosTC = () => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.getTodolists().then(res => {
        dispatch(setTodolistsAC(res.data))
    })
}

export const addTodolistTC = (title: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.createTodolist(title).then(res => {
        dispatch(addTodolistAC(res.data.data.item))
    })
}

export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.deleteTodolist(todolistId).then(res => {
        dispatch(removeTodolistAC(todolistId))
    })
}

export const updateTodolistTitleTC = (todolistId: string, title: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.updateTodolist(todolistId, title).then(res => {
        dispatch(changeTodolistTitleAC(todolistId, title))
    })
}



