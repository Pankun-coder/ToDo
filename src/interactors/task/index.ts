import useSWR, { useSWRConfig } from "swr";
import { TaskBody } from "../../entities/task";
import TaskRepository from "../../repositories/task";

const SWR_KEY = "task";

export const useTasks = (repository: TaskRepository) => {
  const { data, mutate } = useSWR([SWR_KEY, repository], ([, repo]) =>
    repo.bulkGet(),
  );

  const create = async (body: TaskBody) => {
    const createdTaskId = repository.create(body);
    mutate();
    return createdTaskId;
  };

  return {
    data,
    create,
  };
};

export const useTask = (id: string, repository: TaskRepository) => {
  const { data } = useSWR([SWR_KEY, repository, id], ([, repo, taskId]) =>
    repo.get(taskId),
  );

  const { mutate } = useSWRConfig();
  const globalMutate = () =>
    mutate((key: unknown) => Array.isArray(key) && key.includes(SWR_KEY));

  const markAsDone = async () => {
    if (typeof data === "undefined") {
      throw new Error("data not ready");
    }
    repository.update(data.id, { ...data, status: "completed" });
    globalMutate();
    return id;
  };

  const markAsNotCompleted = async () => {
    if (typeof data === "undefined") {
      throw new Error("data not ready");
    }
    repository.update(data.id, { ...data, status: "toDo" });
    globalMutate();
    return id;
  };

  const insertTo = async (index: number) => {
    if (typeof data === "undefined") {
      throw new Error("data not ready");
    }
    const tasks = repository.bulkGet();
    tasks.forEach((task) => {
      if (task.order >= index)
        repository.update(task.id, { ...task, order: task.order + 1 });
    });
    repository.update(data.id, { ...data, order: index });
    return id;
  };

  const physicalDelete = async () => {
    repository.physicalDelete(id);
    return id;
  };

  return {
    data,
    markAsDone,
    markAsNotCompleted,
    insertTo,
    physicalDelete,
  };
};
