import React, { useRef } from "react";
import { Card, IconButton, useTheme } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DragIndicator from "@mui/icons-material/DragIndicator";
import { useTasks } from "../interactors/task";
import { taskStorage } from "../storage/task";

export default function TaskCreator() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { create } = useTasks(taskStorage);
  const theme = useTheme();
  const onBlur = async () => {
    if (!inputRef.current || inputRef.current.value === "") return;
    await create({ label: inputRef.current.value, status: "toDo" });
    inputRef.current.value = "";
  };

  return (
    <Card
      sx={{
        display: "flex",
        height: "40px",
        backgroundColor: "grey.100",
        alignItems: "center",
      }}
    >
      <IconButton disabled>
        <CheckCircleOutlineIcon />
      </IconButton>
      <DragIndicator color="disabled" />
      <input
        ref={inputRef}
        style={{
          height: "40px",
          borderWidth: 0,
          outline: "none",
          backgroundColor: "inherit",
          ...theme.typography.body1,
        }}
        onBlur={onBlur}
        placeholder="タスクを追加..."
      />
    </Card>
  );
}
