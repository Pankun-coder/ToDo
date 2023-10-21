import z from "zod";
import { v4 as uuid } from "uuid";
import zodTask, { TaskBody, Task } from "../../entities/task";

const TASKS_STORAGE_KEY = "tasks";

const getFromLocalStorage = () => {
  const strageItem = localStorage.getItem(TASKS_STORAGE_KEY);
  if (strageItem === null) {
    return [];
  }
  const tasks = JSON.parse(strageItem);
  const parsed = z.array(zodTask).parse(tasks);
  return parsed;
};

const saveInLocalStorace = (tasks: Task[]) => {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
};

export const getTask = (id: string) => {
  const tasks = getFromLocalStorage();
  const targetTask = tasks.find((task) => task.id === id);
  if (typeof targetTask === "undefined") {
    throw new Error("task not found");
  }
  return targetTask;
};

export const getTasks = () => {
  const tasks = getFromLocalStorage();
  return tasks.sort((a, b) => (a.order > b.order ? 1 : -1));
};

export const createTask = (task: TaskBody) => {
  const tasks = getFromLocalStorage();
  const newTask: Task = {
    ...task,
    id: uuid(),
    order: tasks.length,
  };
  saveInLocalStorace([...tasks, newTask]);
};

export const deleteTask = (id: string) => {
  const tasks = getFromLocalStorage();
  const filtered = tasks.filter((task) => task.id !== id);
  if (!(tasks.length > filtered.length)) {
    throw new Error("Task not found");
  }
  saveInLocalStorace(filtered);
};

export const updateTask = (id: string, body: Omit<Task, "id">) => {
  const tasks = getFromLocalStorage();
  const targetTask = tasks.find((task) => task.id === id);
  if (!targetTask) {
    throw new Error("task not found");
  }
  const others = tasks.filter((task) => task.id !== id);
  const updatedTask = { id, ...body };
  saveInLocalStorace([...others, updatedTask]);
};
