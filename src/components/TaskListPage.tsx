import React from "react";
import Box from "@mui/material/Box";
import { useTasks } from "../interactors/task";
import { taskStorage } from "../storage/task";
import DraggableTask from "./DraggableTask";
import TaskCreator from "./TaskCreatorUncontrolled";

export default function TaskListPage() {
  const { data: tasks } = useTasks(taskStorage);

  return (
    <Box
      sx={{
        minWidth: "100vw",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{ padding: (theme) => `${theme.spacing(2)} ${theme.spacing(1)}` }}
      >
        <Box
          sx={{
            p: 1,
            display: "flex",
            flexDirection: "column",
            gap: (theme) => theme.spacing(1),
          }}
        >
          {tasks?.map((task) => <DraggableTask task={task} key={task.id} />)}
          <TaskCreator />
        </Box>
      </Box>
    </Box>
  );
}
