import {addTodolistAC, removeTodolistAC, setTodolistsAC} from '../../todolists-reducer';
import {TaskStatuses, TaskType, todolistsAPI} from '../../../../api/todolists-api'
import {Dispatch} from "redux";
import {AppRootStateType} from "../../../../app/store";
import {TasksStateType} from "../../TodolistsList";

// types-------------------------------------------------------------------//
export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>

export type AddTaskActionType = ReturnType<typeof addTaskAC>

type ActionsType = RemoveTaskActionType | AddTaskActionType
    | ReturnType<typeof changeTaskStatusAC>
    | ReturnType<typeof changeTaskTitleAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof setTodolistsAC>
    | ReturnType<typeof setTasksAC>

const initialState: TasksStateType = {
    /*"todolistId1": [
        { id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ],
    "todolistId2": [
        { id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ]*/

}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'SET-TASKS': return {...state, [action.todolistId]: action.tasks}

        case 'REMOVE-TASK': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)
            };
        }
        case 'ADD-TASK': return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]};

        case 'CHANGE-TASK-STATUS': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t =>
                    t.id === action.taskId ? {...t, status: action.status} : t
                )
            };
        }
        case 'CHANGE-TASK-TITLE': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t =>
                    t.id === action.taskId ? {...t, title: action.title} : t
                )
            };
        }
        case 'ADD-TODOLIST':return {...state, [action.todolist.id]: []};

        case 'REMOVE-TODOLIST': {
            const {[action.id]: removed, ...rest} = state;
            return rest;
        }
        case 'SET-TODOLISTS': {
            return action.todolists.reduce((acc, tl) => {
                acc[tl.id] = [];
                return acc;
            }, {...state});
        }
        default:
            return state;
    }
}


//actions-------------------------------------------------------------------------------------------------------------//
export const removeTaskAC = (taskId: string, todolistId: string) => ({
    type: 'REMOVE-TASK',
    taskId: taskId,
    todolistId: todolistId
} as const)
export const addTaskAC = (task: TaskType) => ({type: 'ADD-TASK', task} as const)
export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string) => ({
    type: 'CHANGE-TASK-STATUS',
    status,
    todolistId,
    taskId
} as const)
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) => ({
    type: 'CHANGE-TASK-TITLE',
    title,
    todolistId,
    taskId
} as const)
export const setTasksAC = (todolistId: string, tasks: TaskType[]) => ({type: 'SET-TASKS', todolistId, tasks} as const)


//thunks--------------------------------------------------------------------------------------------------------------//
export const getTasksTC = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.getTasks(todolistId).then(res => {
        dispatch(setTasksAC(todolistId, res.data.items))
    })
}

export const addTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.createTask(todolistId, title).then(res => {
        dispatch(addTaskAC(res.data.data.item))
    })
}

export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.deleteTask(todolistId, taskId).then(res => {
        dispatch(removeTaskAC(taskId, todolistId))
    })
}

export const updateTaskStatusTC = (todolistId: string, taskId: string, status: TaskStatuses) => {
    return (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {
        const tasks = getState().tasks
        const task = tasks[todolistId].find((t) => t.id === taskId)
        if (task) {
            const model = {
                title: task.title,
                description: task.description,
                status: status,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline,
            }

            todolistsAPI.updateTask(todolistId, taskId, model).then(res => {
                dispatch(changeTaskStatusAC(taskId, status, todolistId))
            })
        }
    }
}

export const updateTaskTitleTC = (todolistId: string, taskId: string, title: string) => {
    return (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {
        const tasks = getState().tasks
        const task = tasks[todolistId].find((t) => t.id === taskId)
        if (task) {
            const model = {
                title: title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline,
            }

            todolistsAPI.updateTask(todolistId, taskId, model).then(res => {
                dispatch(changeTaskTitleAC(taskId, title, todolistId))
            })
        }
    }
}

