import { Delete } from "@mui/icons-material"
import { Checkbox, IconButton } from "@mui/material"
import { EditableSpan } from "common/components"
import { TaskStatuses } from "common/enums"
import React, { ChangeEvent } from "react"
import { useAppDispatch } from "common/hooks"
import { TaskData } from "../../../../api/tasksApi.types"
import { tasksThunks } from "../../../../model/tasksSlice"
import s from "./Task.module.css"

type Props = {
  task: TaskData
}

export const Task = ({ task }: Props) => {
  const { id: taskId, title, status, todoListId: todolistId } = task

  const dispatch = useAppDispatch()

  const removeTaskHandler = () => {
    dispatch(tasksThunks.removeTask({ taskId, todolistId }))
  }

  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
    dispatch(tasksThunks.updateTask({ taskId, domainModel: { status }, todolistId }))
  }

  const changeTaskTitleHandler = (title: string) => {
    dispatch(tasksThunks.updateTask({ taskId, domainModel: { title }, todolistId }))
  }

  let checked = status === TaskStatuses.Completed

  return (
    <div key={taskId} className={checked ? s.isDone : ""}>
      <Checkbox checked={checked} color="primary" onChange={changeTaskStatusHandler} />
      <EditableSpan value={title} onChange={changeTaskTitleHandler} />
      <IconButton onClick={removeTaskHandler}>
        <Delete />
      </IconButton>
    </div>
  )
}
