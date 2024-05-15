import type {Meta, StoryObj} from '@storybook/react';
import {fn} from '@storybook/test';
import {Task} from "../Task";
import {TaskType} from "../Todolist";
import {useState} from "react";
import {v1} from "uuid";


const meta: Meta<typeof Task> = {
    title: 'TODOLISTS/Task',
    component: Task,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
      changeTaskStatus: fn(),
      changeTaskTitle: fn(),
      removeTask: fn(),
      task: {id: 'fghnjm', isDone: false, title: 'CSS'},
      todolistId: 'fghjmklkjh'
    }
};

export default meta;
type Story = StoryObj<typeof Task>;

export const TaskIsNotDoneStory: Story = {};

export const TaskIsDoneStory: Story = {
  args: {
    task: {id: 'jhgfd', isDone: true, title: 'HTML'},
  }
};

export const TaskToggleStory: Story = {
  render: (args) => {

    const [task, setTask] = useState({id: v1(), isDone: false, title: 'CSS'})

      function changeTaskStatus () {
        setTask({...task, isDone: !task.isDone})
      }

      function changeTaskTitle (taskId: string, title: string) {
          setTask({...task, title: title})
      }


    return <Task changeTaskStatus={changeTaskStatus}
                 changeTaskTitle={changeTaskTitle}
                 removeTask={args.removeTask}
                 task={task}
                 todolistId={'kjhgfdeeeffff'}
    />}
};
