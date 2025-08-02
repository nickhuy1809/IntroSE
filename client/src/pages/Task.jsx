import styled from "@emotion/styled";
import CurrentWeekCalendar from "../components/CurrentWeekCalendar";
import TaskExplorer from '../components/TaskExplorer';

const TaskContainer = styled("div")({
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  gap: "0px",
  position: "relative",
});

const CalendarBox = styled("div")({
  flex: "0.2 0.2 300px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  borderRadius: "12px",
  padding: "1rem",
  right : "1rem",
  position: "fixed",
  overflow: "hidden",
});

export default function Task() {
  return (
    <div className="task-page">
      <TaskContainer>
        <CalendarBox>
          <CurrentWeekCalendar />
        </CalendarBox>
        <TaskExplorer />
        {/* Add more components here, like task lists, task details, etc. */}
      </TaskContainer>
    </div>
  );
}