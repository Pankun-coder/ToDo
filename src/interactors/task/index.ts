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
  const { data, error } = useSWR(
    [SWR_KEY, repository, id],
    ([, repo, taskId]) => repo.get(taskId),
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
    const { affectedTasks, direction } = (() => {
      if (index < data.order) {
        const affected = tasks.filter(
          (task) => index <= task.order && task.order < data.order,
        );
        return { affectedTasks: affected, direction: 1 };
      } else {
        const affected = tasks.filter(
          (task) => data.order < task.order && task.order <= index,
        );
        return { affectedTasks: affected, direction: -1 };
      }
    })();
    affectedTasks.forEach((task) => {
      repository.update(task.id, { ...task, order: task.order + direction });
    });
    repository.update(data.id, { ...data, order: index });
    globalMutate();
    return id;
  };

  const physicalDelete = async () => {
    repository.physicalDelete(id);
    globalMutate();
    return id;
  };

  return {
    data: error ? undefined : data,
    markAsDone,
    markAsNotCompleted,
    insertTo,
    physicalDelete,
  };
};
