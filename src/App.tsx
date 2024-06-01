import React from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.css";
import TaskListPage from "./components/TaskListPage";

// TODO: https://qiita.com/hiyamamoto/items/d83cf4ccfcfa886a0ba8
// TODO: replace backend reffering this article

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <TaskListPage />
    </DndProvider>
  );
}

export default App;
