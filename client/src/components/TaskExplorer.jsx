import styled from "@emotion/styled";
import { useState } from 'react';
import TaskFrame from './TaskFrame';
import Button from '../components/Button';

const TaskMainContent = styled("div")({
  display: "flex",
  flexDirection: "column",
  position: "relative",
  width: "1070px",
  height: "1200px",
  padding: "0px",
  boxSizing: "border-box",
  overflow: "hidden",
  borderRadius: "15px",
  top: "0 px",
  left: "0px",
  right: "0px",
  bottom: "0px",
  "::-webkit-scrollbar": {
    display: "none",
  },
  scrollbarWidth: "none",
});

const TaskHeading = styled("div")({
  color: "#16430E",
  fontFamily: "EB Garamond",
  fontSize: "44px",
  fontStyle: "normal",
  fontWeight: "800",
  lineHeight: "normal",
  position: "absolute",
  top: "60px",
  left: "30px",
  zIndex: 2,
});

const SortButtonGroup = styled("div")({
  display: "flex",
  flkexDirection: "row",
  gap: "30px",
  marginTop: "320px",
  justifyContent: "center",
  left: "60px",
  zIndex: 2,
});

const SortButton = styled("button")(({ selected }) => ({
  padding: "10px 20px",
  borderRadius: "25px",
  fontSize: "30px",
  fontWeight: "550",
  cursor: "pointer",
  background: selected ? "#58815F" : "#FFF",
  color: selected ? "#FFF" : "#58815F",
  border: selected ? "none" : "5px solid #58815F",
  transition: "background 0.2s, border 0.4s",
}));

const TaskManagerContainer = styled("div")({
  display: "block",
  padding: 0,
  boxSizing: "border-box",
  width: "1024px",
  maxHeight: "700px",
  overflowY: "auto",
  background: "transparent",
  position: "absolute",
  top: "400px",
  left: "20px",
  isolation: "isolate",
  "::-webkit-scrollbar": {
    display: "none",
  },
  scrollbarWidth: "none",
});

const TaskMenu = styled("img")({
  height: `277px`,
  width: `1070px`,
  position: `absolute`,
  left: `0px`,
  top: `125px`,
});


function TaskExplorer() {
  const [selectedSort, setSelectedSort] = useState("A");

  const sortOptions = ["All tasks", "Status", "Priority", "Due date"]; // Replace with real sort names

  return (
    <TaskMainContent>
      <TaskHeading>Manage your tasks</TaskHeading>

      <SortButtonGroup>
        {sortOptions.map((option) => (
          <SortButton
            key={option}
            selected={selectedSort === option}
            onClick={() => setSelectedSort(option)}
          >
            {option}
          </SortButton>
        ))}
      </SortButtonGroup>

      <div style={{ position: "absolute", top: "140px", left: "850px", zIndex: 2 }}>
        <Button />
      </div>

      <TaskMenu as='svg'xmlns="http://www.w3.org/2000/svg" width="1076" height="283" viewBox="0 0 1076 283" fill="none">
      <path d="M1023 1.5C1051.44 1.5 1074.5 24.5573 1074.5 53V230C1074.5 258.443 1051.44 281.5 1023 281.5H53C24.5573 281.5 1.5 258.443 1.5 230V53C1.5 24.5573 24.5573 1.5 53 1.5H1023Z" fill="#FFF6F6" stroke="#58815F" stroke-width="3"/>
      </TaskMenu> 
    <TaskManagerContainer>
      <TaskFrame />
      <TaskFrame />
      <TaskFrame />
      <TaskFrame />
      <TaskFrame />
      <TaskFrame />
    </TaskManagerContainer>
    </TaskMainContent>
  );  
}

export default TaskExplorer;