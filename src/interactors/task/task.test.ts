// @vitest-environment happy-dom
import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useTasks, useTask } from ".";
import { Task, TaskBody } from "../../entities/task";
import TaskRepository from "../../repositories/task";

class MockTaskRepository implements TaskRepository {
  tasks: Task[] = [];

  get(id: string) {
    const targetTask = this.tasks.find((task) => task.id === id);
    if (typeof targetTask === "undefined") {
      throw new Error("task not found");
    }
    return targetTask;
  }

  bulkGet() {
    return this.tasks;
  }

  create(body: TaskBody) {
    const newId = body.label;
    this.tasks = [
      ...this.tasks,
      {
        id: newId,
        order: this.tasks.length,
        created: new Date(),
        updated: new Date(),
        ...body,
      },
    ];
    return newId;
  }

  update(id: string, body: Omit<Task, "id">) {
    const targetTask = this.tasks.find((task) => task.id === id);
    if (typeof targetTask === "undefined") {
      throw new Error("task not found");
    }
    const others = this.tasks.filter((task) => task.id !== id);
    this.tasks = [...others, { ...body, id, updated: new Date() }];
    return id;
  }

  physicalDelete(id: string) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    return id;
  }
}

describe("useTasks interactor", () => {
  it("creates new task with given label and status", async () => {
    const mockRepository = new MockTaskRepository();
    const { result } = renderHook(() => useTasks(mockRepository));

    await act(async () => {
      await result.current.create({
        label: "newTask",
        status: "toDo",
      });
    });

    expect(result.current.data).toBeTruthy();
    expect(result.current.data!.length).toBe(1);
    expect(result.current.data![0].label).toBe("newTask");
    expect(result.current.data![0].status).toBe("toDo");
  });
});

describe("useTask interactor", () => {
  it("marks task as completed", async () => {
    const mockRepository = new MockTaskRepository();
    const testTask = { label: "testTask", status: "toDo" as const };
    const { result: tasksResult } = renderHook(() => useTasks(mockRepository));
    await act(() => tasksResult.current.create(testTask));

    const { result } = renderHook(() =>
      useTask(testTask.label, mockRepository),
    );
    await waitFor(() => expect(result.current.data).toBeTruthy());
    expect(result.current.data!.label).toBe(testTask.label);
    expect(result.current.data!.status).toBe(testTask.status);

    await act(() => result.current.markAsDone());
    expect(result.current.data?.status).toBe("completed");
  });

  it("marks task as toDo", async () => {
    const mockRepository = new MockTaskRepository();
    const testTask = { label: "testTask", status: "completed" as const };
    const { result: tasksResult } = renderHook(() => useTasks(mockRepository));
    await act(() => tasksResult.current.create(testTask));

    const { result } = renderHook(() =>
      useTask(testTask.label, mockRepository),
    );
    await waitFor(() => expect(result.current.data).toBeTruthy());
    expect(result.current.data!.label).toBe(testTask.label);
    expect(result.current.data!.status).toBe(testTask.status);

    await act(() => result.current.markAsNotCompleted());
    expect(result.current.data!.status).toBe("toDo");
  });

  it("inserts to designated index", async () => {
    const mockRepository = new MockTaskRepository();
    const testTasks = [
      { label: "testTask0", status: "completed" as const },
      { label: "testTask1", status: "completed" as const },
      { label: "testTask2", status: "completed" as const },
    ];
    const { result: tasksResult } = renderHook(() => useTasks(mockRepository));

    await act(() =>
      Promise.all(
        testTasks.map(async (task) => tasksResult.current.create(task)),
      ),
    );

    expect(tasksResult.current.data?.length).toBe(3);
    tasksResult.current.data?.forEach((task, i) => {
      expect(task.order).toEqual(i);
    });
    const { id } = tasksResult.current.data![0];
    // mock repository registers label as id
    const { result } = renderHook(() => useTask(id, mockRepository));
    await waitFor(() => expect(result.current.data).toBeTruthy());
    await act(() => result.current.insertTo(2));
    expect(result.current.data?.order).toBe(2);

    const expectationTable = [
      { id: "testTask0", order: 2 },
      { id: "testTask1", order: 0 },
      { id: "testTask2", order: 1 },
    ];
    tasksResult.current.data?.forEach((data) => {
      const { order: expectation } = expectationTable.find(
        (row) => row.id === data.id,
      )!;
      expect(data.order).toBe(expectation);
    });
  });

  it("deletes task", async () => {
    const mockRepository = new MockTaskRepository();
    const testTasks = [
      { label: "testTask0", status: "completed" as const },
      { label: "testTask1", status: "completed" as const },
      { label: "testTask2", status: "completed" as const },
    ];
    const { result: tasksResult } = renderHook(() => useTasks(mockRepository));

    await act(() =>
      Promise.all(
        testTasks.map(async (task) => tasksResult.current.create(task)),
      ),
    );

    expect(tasksResult.current.data?.length).toBe(3);
    const { id } = tasksResult.current.data![0];
    // mock repository registers label as id
    const { result } = renderHook(() => useTask(id, mockRepository));
    await waitFor(() => expect(result.current.data).toBeTruthy());
    await act(() => result.current.physicalDelete());
    await waitFor(() => expect(result.current.data).toBe(undefined));
    expect(tasksResult.current.data?.length).toBe(2);
  });
});
