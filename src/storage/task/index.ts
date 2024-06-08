import z from "zod";
import { v4 as uuid } from "uuid";
import zodTask, { TaskBody, Task } from "../../entities/task";
import TaskRepository from "../../repositories/task";

const TASKS_STORAGE_KEY = "tasks";

type TaskWithStrDate = Omit<Task, "created" | "updated"> & {
  created: string;
  updated: string;
};

const parseIntoString = (tasks: Task[]): string => {
  const tasksWithStrDates: TaskWithStrDate[] = tasks.map((task) => ({
    ...task,
    created: task.created.toISOString(),
    updated: task.updated.toISOString(),
  }));

  return JSON.stringify(tasksWithStrDates);
};

const parseIntoJSON = (tasksString: string): Task[] => {
  const parsed: TaskWithStrDate[] = JSON.parse(tasksString);

  return parsed.map((task) => ({
    ...task,
    created: new Date(task.created),
    updated: new Date(task.updated),
  }));
};

const getFromLocalStorage = () => {
  const strageItem = localStorage.getItem(TASKS_STORAGE_KEY);
  if (strageItem === null) {
    return [];
  }
  const tasks = parseIntoJSON(strageItem);
  const parsed = z.array(zodTask).parse(tasks);
  return parsed;
};

const saveInLocalStorace = (tasks: Task[]) => {
  localStorage.setItem(TASKS_STORAGE_KEY, parseIntoString(tasks));
};

export const taskStorage: TaskRepository = {
  get: (id: string) => {
    const tasks = getFromLocalStorage();
    const targetTask = tasks.find((task) => task.id === id);
    if (typeof targetTask === "undefined") {
      throw new Error("task not found");
    }
    return targetTask;
  },

  bulkGet: () => {
    const tasks = getFromLocalStorage();
    return tasks.sort((a, b) => (a.order > b.order ? 1 : -1));
  },

  create: (task: TaskBody) => {
    const tasks = getFromLocalStorage();
    const id = uuid();
    const newTask: Task = {
      ...task,
      id,
      order: tasks.length,
      created: new Date(),
      updated: new Date(),
    };
    saveInLocalStorace([...tasks, newTask]);
    return id;
  },

  physicalDelete: (id: string) => {
    const tasks = getFromLocalStorage();
    const filtered = tasks.filter((task) => task.id !== id);
    if (!(tasks.length > filtered.length)) {
      throw new Error("Task not found");
    }
    saveInLocalStorace(filtered);
    return id;
  },

  update: (id: string, body: Omit<Task, "id">) => {
    const tasks = getFromLocalStorage();
    const targetTask = tasks.find((task) => task.id === id);
    if (!targetTask) {
      throw new Error("task not found");
    }
    const others = tasks.filter((task) => task.id !== id);
    const updatedTask = { id, ...body, updated: new Date() };
    saveInLocalStorace([...others, updatedTask]);
    return id;
  },
};

export default getFromLocalStorage;
