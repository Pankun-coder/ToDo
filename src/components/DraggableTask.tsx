import React from "react";
import { Card } from "@mui/material";
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
  const { insertTo } = useTask(task.id, taskStorage);
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

  return (
    <Card
      ref={(el) => dropRef(dragRef(el))}
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
