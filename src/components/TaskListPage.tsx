import React from "react";
import { useTasks } from "../interactors/task";
import { taskStorage } from "../storage/task";
import DraggableTask from "./DraggableTask";
import Box from "@mui/material/Box";

export default function TaskListPage() {
  const { data: tasks } = useTasks(taskStorage);

  return (
    <Box sx={{ p: 1, display: "flex", flexDirection: "column", gap: 1 }}>
      {tasks?.map((task) => <DraggableTask task={task} key={task.id} />)}
    </Box>
  );
}
