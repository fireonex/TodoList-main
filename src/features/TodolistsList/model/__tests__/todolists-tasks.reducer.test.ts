import { Todolist } from "../../api/todolistsApi.types"
import { tasksReducer, TasksState } from "../tasksSlice"
import { TodolistDomain, todolistsReducer, todolistsThunks } from "../todolistsSlice"

test("ids should be equals", () => {
  const startTasksState: TasksState = {}
  const startTodolistsState: Array<TodolistDomain> = []

  let todolist: Todolist = {
    title: "new todolist",
    id: "any id",
    addedDate: "",
    order: 0,
  }

  const action = todolistsThunks.addTodolist.fulfilled({ todolist: todolist }, "requestId", todolist.title)

  const endTasksState = tasksReducer(startTasksState, action)
  const endTodolistsState = todolistsReducer(startTodolistsState, action)

  const keys = Object.keys(endTasksState)
  const idFromTasks = keys[0]
  const idFromTodolists = endTodolistsState[0].id

  expect(idFromTasks).toBe(action.payload.todolist.id)
  expect(idFromTodolists).toBe(action.payload.todolist.id)
})
