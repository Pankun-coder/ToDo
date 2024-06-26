import React from "react";
import { Card, IconButton, useTheme } from "@mui/material";
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
  const theme = useTheme();
  const { insertTo, markAsDone, markAsNotCompleted } = useTask(
    task.id,
    taskStorage,
  );
  const [, dragRef] = useDrag(
    () => ({
      type: "task",
      item: { insertDraggedItem: insertTo },
    }),
    [insertTo],
  );

  const [, dropRef] = useDrop(
    () => ({
      accept: "task",
      drop: async ({
        insertDraggedItem,
      }: {
        insertDraggedItem: (index: number) => Promise<string>;
      }) => {
        await insertDraggedItem(task.order);
      },
    }),
    [task.order],
  );

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
        height: "40px",
        backgroundColor: "grey.100",
        alignItems: "center",
        opacity: task.status === "completed" ? 0.3 : 1,
      }}
    >
      <IconButton onClick={toggleStatus}>
        <CheckCircleOutlineIcon />
      </IconButton>
      <DragIndicator />
      <span style={{ ...theme.typography.body1 }}>{task.label}</span>
    </Card>
  );
}
