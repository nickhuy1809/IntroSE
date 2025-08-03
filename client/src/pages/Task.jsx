import { useState, useEffect, useCallback } from 'react';
import styled from "@emotion/styled";
import CurrentWeekCalendar from "../components/CurrentWeekCalendar";
import TaskExplorer from '../components/TaskExplorer';

const TaskContainer = styled("div")({
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  gap: "20px",
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

  const [selectedDate, setSelectedDate] = useState(null);

  // `allTasks` lưu trữ danh sách tổng tất cả các task chưa hoàn thành.
  const [allTasks, setAllTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const accountId = localStorage.getItem('accountId');

  // Hàm này sẽ lấy TẤT CẢ các task chưa hoàn thành.
  const fetchAllTasks = useCallback(async () => {
    if (!accountId) return; // Không làm gì nếu chưa có accountId
    
    setIsLoading(true);
    setError(null);
    try {
      // Gọi đến API tasks và lấy các task chưa hoàn thành
      const response = await fetch(`http://localhost:5000/api/tasks?isCompleted=false`, {
        headers: { 'x-account-id': accountId },
      });
      if (!response.ok) throw new Error('Không thể tải dữ liệu công việc');
      const data = await response.json();
      setAllTasks(data); // Cập nhật danh sách tổng
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [accountId]);

  // Gọi hàm fetchAllTasks một lần khi component được tạo
  useEffect(() => {
    fetchAllTasks();
  }, [fetchAllTasks]);

  const tasksToDisplay = selectedDate
    ? allTasks.filter(task => 
        task.dueDate && new Date(task.dueDate).toDateString() === selectedDate.toDateString()
      )
    : allTasks;

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