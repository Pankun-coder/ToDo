import z from "zod";
import { v4 as uuid } from "uuid";
import zodTask, { TaskBody, Task } from "../../entities/task";
import TaskRepository from "../../repositories/task";

const TASKS_STORAGE_KEY = "tasks";

export class taskStorage implements TaskRepository {
  #getFromLocalStorage = () => {
    const strageItem = localStorage.getItem(TASKS_STORAGE_KEY);
    if (strageItem === null) {
      return [];
    }
    const tasks = JSON.parse(strageItem);
    const parsed = z.array(zodTask).parse(tasks);
    return parsed;
  };

  #saveInLocalStorace = (tasks: Task[]) => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  };

  get = (id: string) => {
    const tasks = this.#getFromLocalStorage();
    const targetTask = tasks.find((task) => task.id === id);
    if (typeof targetTask === "undefined") {
      throw new Error("task not found");
    }
    return targetTask;
  };

  bulkGet = () => {
    const tasks = this.#getFromLocalStorage();
    return tasks.sort((a, b) => (a.order > b.order ? 1 : -1));
  };

  create = (task: TaskBody) => {
    const tasks = this.#getFromLocalStorage();
    const id = uuid();
    const newTask: Task = {
      ...task,
      id,
      order: tasks.length,
    };
    this.#saveInLocalStorace([...tasks, newTask]);
    return id;
  };

  physicalDelete = (id: string) => {
    const tasks = this.#getFromLocalStorage();
    const filtered = tasks.filter((task) => task.id !== id);
    if (!(tasks.length > filtered.length)) {
      throw new Error("Task not found");
    }
    this.#saveInLocalStorace(filtered);
    return id;
  };

  update = (id: string, body: Omit<Task, "id">) => {
    const tasks = this.#getFromLocalStorage();
    const targetTask = tasks.find((task) => task.id === id);
    if (!targetTask) {
      throw new Error("task not found");
    }
    const others = tasks.filter((task) => task.id !== id);
    const updatedTask = { id, ...body };
    this.#saveInLocalStorace([...others, updatedTask]);
    return id;
  };
}
