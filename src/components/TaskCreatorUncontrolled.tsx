import React, { useRef } from "react";
import { Card, Input } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DragIndicator from "@mui/icons-material/DragIndicator";
import { useTasks } from "../interactors/task";
import { taskStorage } from "../storage/task";

export default function TaskCreator() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { create } = useTasks(taskStorage);
  const onBlur = async () => {
    if (!inputRef.current || inputRef.current.value === "") return;
    await create({ label: inputRef.current.value, status: "toDo" });
    inputRef.current.value = "";
  };

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
      <Input inputRef={inputRef} onBlur={onBlur} />
    </Card>
  );
}
