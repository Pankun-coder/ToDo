import React from "react";
import { Card } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DragIndicator from "@mui/icons-material/DragIndicator";
import { Task } from "../entities/task";

type Props = {
  task: Task;
};

export default function DraggableTask({ task }: Props) {
  return (
    <Card
      sx={{
        display: "flex",
        height: "32px",
        backgroundColor: "background.paper",
        alignItems: "center",
      }}
    >
      <CheckCircleOutlineIcon />
      <DragIndicator />
      {task.label}
    </Card>
  );
}
