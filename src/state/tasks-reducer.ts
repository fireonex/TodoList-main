import {TasksStateType} from '../App';
import {v1} from "uuid";
import {AddTodolistActionType, RemoveTodolistActionType} from "./todolists-reducer";


export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>

export type addTaskActionType = ReturnType<typeof addTaskAC>

export type changeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>

export type changeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>


type ActionsType = RemoveTaskActionType |
    addTaskActionType |
    changeTaskStatusActionType |
    changeTaskTitleActionType |
    AddTodolistActionType |
    RemoveTodolistActionType



export const tasksReducer = (state: TasksStateType, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)};

        case 'ADD-TASK':
            const stateCopy = {...state};
            const tasks2 = stateCopy[action.todolistId];
            const newTask = {
                id: v1(),
                title: action.title,
                isDone: false
            }
            const newTasks = [newTask, ...tasks2]
            stateCopy[action.todolistId] = newTasks
            return stateCopy;
        case 'CHANGE-TASK-STATUS':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id == action.taskId ? {
                    ...t,
                    isDone: action.isDone
                } : t)
            }

        case 'CHANGE-TASK-TITLE':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id == action.taskId ? {
                    ...t,
                    title: action.title
                } : t)
            }

        case "ADD-TODOLIST": {
            return {
                ...state, [action.todolistId]: []
            }
        }

        case "REMOVE-TODOLIST": {
            // const stateCopy = {...state}
            // delete stateCopy[action.id]
            // return stateCopy

            let {[action.id]: [], ...rest} = state
            return rest
        }

        default:
            throw new Error("I don't understand this type")
    }
}


export const removeTaskAC = (taskId: string, todolistId: string) => {
    return {type: 'REMOVE-TASK', taskId, todolistId} as const
}

export const addTaskAC = (title: string, todolistId: string) => {
    return {type: 'ADD-TASK', title, todolistId} as const
}

export const changeTaskStatusAC = (taskId: string, isDone: boolean, todolistId: string) => {
    return {type: 'CHANGE-TASK-STATUS', taskId, isDone, todolistId} as const
}

export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) => {
    return {type: 'CHANGE-TASK-TITLE', taskId, title, todolistId} as const
}

//аналог delete
// let object = {a: 1, b: 2, c: 3}
//
// let {b, ...newObject} = object
//
// newObject = {
//     a: 1, c: 3
// }



