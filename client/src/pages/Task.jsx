import { useState, useEffect, useCallback } from 'react';
import styled from "@emotion/styled";
import CurrentWeekCalendar from "../components/CurrentWeekCalendar";
import TaskExplorer from '../components/TaskExplorer';

const TaskContainer = styled("div")({
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  gap: "20px",
  position: "fixed",
  "@media (max-width: 1200px)": {
    flexDirection: "column",
    position: "static",
    gap: "12px",
  },
  "@media (max-width: 800px)": {
    flexDirection: "column",
    position: "static",
    gap: "8px",
  },
});

const CalendarBox = styled("div")({
  flex: "0.2 0.2 300px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  borderRadius: "12px",
  padding: "1rem",
  right: "1rem",
  position: "fixed",
  overflow: "hidden",
  zIndex: 1201,
  "@media (max-width: 1200px)": {
    position: "sticky",
    width: "auto",
    marginBottom: "0px",
  },
  "@media (max-width: 800px)": {
    position: "static",
    width: "auto",
    marginBottom: "8px",
    padding: "0.5rem",
  },
});

const ToggleButton = styled("button")({
  border: "none",
  background: "#4d774e",
  color: "#fff",
  borderRadius: "50%",
  width: "40px",
  height: "40px",
  fontSize: "1.5rem",
  cursor: "pointer",
  boxShadow: "0 2px 8px rgba(77,119,78,0.12)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "absolute",
  top: "10px",
  right: "10px",
  zIndex: 2,
  transition: "background 0.2s",
  "&:hover": {
    background: "#164a41"
  }
});

export default function Task() {
  const [showCalendar, setShowCalendar] = useState(true);

  const [selectedDate, setSelectedDate] = useState(null);
  const [allTasks, setAllTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const accountId = localStorage.getItem('accountId');

  const fetchAllTasks = useCallback(async () => {
    if (!accountId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/tasks?isCompleted=false`, {
        headers: { 'x-account-id': accountId },
      });
      if (!response.ok) throw new Error('Không thể tải dữ liệu công việc');
      const data = await response.json();
      setAllTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    fetchAllTasks();
  }, [fetchAllTasks]);

  return (
    <div className="task-page">
      <TaskContainer>
        <CalendarBox collapsed={!showCalendar}>
          <ToggleButton
            onClick={() => setShowCalendar(v => !v)}
            title={showCalendar ? "Expand weekly calendar" : "Collapse weekly calendar"}
          >
            {showCalendar ? "−" : "+"}
          </ToggleButton>
          {showCalendar && <CurrentWeekCalendar />}
        </CalendarBox>
        <TaskExplorer />
      </TaskContainer>
    </div>
  );
}