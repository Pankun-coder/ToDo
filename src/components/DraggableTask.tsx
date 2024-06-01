import React from "react";
import { Card, IconButton } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DragIndicator from "@mui/icons-material/DragIndicator";
import { useDrag, useDrop } from "react-dnd";
import { Task } from "../entities/task";
import { useTask } from "../interactors/task";
import { taskStorage } from "../storage/task";

type Props = {
  task: Task;
};

export default function DraggableTask({ task }: Props) {
  const { insertTo, markAsDone, markAsNotCompleted } = useTask(
    task.id,
    taskStorage,
  );
  const [, dragRef] = useDrag(() => ({
    type: "task",
    item: { insertDraggedItem: insertTo },
  }));

  const [, dropRef] = useDrop(() => ({
    accept: "task",
    drop: async ({
      insertDraggedItem,
    }: {
      insertDraggedItem: (index: number) => Promise<string>;
    }) => {
      await insertDraggedItem(task.order);
    },
  }));

  const toggleStatus = () => {
    if (task.status === "completed") {
      markAsNotCompleted();
    } else {
      markAsDone();
    }
  };

  return (
    <Card
      ref={(el) => dropRef(dragRef(el))}
      sx={{
        display: "flex",
        height: "32px",
        backgroundColor: "background.paper",
        alignItems: "center",
        opacity: task.status === "completed" ? 0.3 : 1,
      }}
    >
      <IconButton onClick={toggleStatus}>
        <CheckCircleOutlineIcon />
      </IconButton>
      <DragIndicator />
      {task.label}
    </Card>
  );
}
