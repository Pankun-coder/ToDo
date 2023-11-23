import { Task, TaskBody } from "../../entities/task";

type TaskRepository = {
  get: (taskId: string) => Task;
  bulkGet: () => Task[];
  update: (id: string, body: Omit<Task, "id">) => string;
  physicalDelete: (id: string) => string;
  create: (body: TaskBody) => string;
};

export default TaskRepository;
