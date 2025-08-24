import styled from "@emotion/styled";
import { useState, useEffect, useCallback } from 'react';
import TaskFrame from './TaskFrame';
import Button from '../components/Button';

const ModalOverlay = styled("div")({
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  zIndex: 1000,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'background-color 0.5s ease'
});

const ModalContent = styled("div")({
  position: "relative",
  background: "#f5f6ef",
  borderRadius: "28px",
  border: "8px solid #4d774e",
  minWidth: "1000px",
  minHeight: "600px",
  padding: "56px 64px",
  boxShadow: "0 12px 48px 0 rgba(60,60,60,0.18)",
  overflow: "hidden",
  zIndex: 2001,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  "@media (max-width: 1200px)": {
    minWidth: "90vw",
    minHeight: "60vh",
    padding: "32px 12px",
  },
  "@media (max-width: 700px)": {
    minWidth: "98vw",
    minHeight: "auto",
    padding: "12px 4px",
    borderRadius: "12px",
  },
});

const ModalTitle = styled("h3")({
  marginTop: 0,
  marginBottom: 24,
  fontSize: "2.2rem",
  fontWeight: 800,
  color: "#164a41",
  textAlign: "center",
  fontFamily: "EB Garamond, serif",
  letterSpacing: "1px"
});

const StyledForm = styled("form")({
  display: "flex",
  flexDirection: "column",
  gap: "22px",
  width: "100%",
  alignItems: "center"
});

const StyledInput = styled("input")({
  fontSize: "1.25rem",
  padding: "12px 18px",
  borderRadius: "12px",
  border: "2px solid #4d774e",
  outline: "none",
  width: "100%",
  fontFamily: "inherit",
  background: "#fff",
  marginBottom: 0,
  transition: "border 0.2s",
  "&:focus": {
    border: "2.5px solid #164a41"
  }
});

const StyledTextarea = styled("textarea")({
  fontSize: "1.15rem",
  padding: "12px 18px",
  borderRadius: "12px",
  border: "2px solid #4d774e",
  outline: "none",
  width: "100%",
  fontFamily: "inherit",
  background: "#fff",
  minHeight: "70px",
  resize: "vertical",
  transition: "border 0.2s",
  "&:focus": {
    border: "2.5px solid #164a41"
  }
});

const StyledSelect = styled("select")({
  fontSize: "1.15rem",
  padding: "10px 16px",
  borderRadius: "12px",
  border: "2px solid #4d774e",
  outline: "none",
  width: "100%",
  fontFamily: "inherit",
  background: "#fff",
  transition: "border 0.2s",
  "&:focus": {
    border: "2.5px solid #164a41"
  }
});

const ButtonRow = styled("div")({
  display: "flex",
  justifyContent: "center",
  gap: "24px",
  marginTop: "10px"
});

const ModernButton = styled("button")(({ variant }) => ({
  padding: "12px 32px",
  fontSize: "1.15rem",
  fontWeight: 700,
  borderRadius: "14px",
  border: "none",
  background: variant === "primary" ? "linear-gradient(90deg,#4d774e,#9dc88d)" : "#fff",
  color: variant === "primary" ? "#fff" : "#4d774e",
  boxShadow: variant === "primary" ? "0 2px 12px 0 rgba(77,119,78,0.12)" : "none",
  cursor: "pointer",
  transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
  borderBottom: variant === "primary" ? "3px solid #164a41" : "2px solid #4d774e",
  "&:hover": {
    background: variant === "primary" ? "linear-gradient(90deg,#9dc88d,#4d774e)" : "#f5f6ef",
    color: "#164a41"
  }
}));

function TaskModal({ isOpen, onClose, onSubmit, initialTask = null, title }) {
  // State nội bộ của Modal để quản lý các trường input
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });

  // Khi modal được mở, cập nhật state của nó với dữ liệu của task cần sửa, hoặc reset về mặc định
  useEffect(() => {
    if (isOpen) {
      if (initialTask) {
        // Chuyển đổi định dạng ngày tháng để input type="date" có thể hiển thị
        const formattedDueDate = initialTask.dueDate ? new Date(initialTask.dueDate).toISOString().split('T')[0] : '';
        setTaskData({
          title: initialTask.title || '',
          description: initialTask.description || '',
          priority: initialTask.priority || 'medium',
          dueDate: formattedDueDate
        });
      } else {
        // Reset về trạng thái mặc định khi thêm mới
        setTaskData({ title: '', description: '', priority: 'medium', dueDate: '' });
      }
    }
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  // Cập nhật state khi người dùng nhập liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prev => ({ ...prev, [name]: value }));
  };

  // Xử lý khi form được submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskData.title.trim()) {
      alert("Tiêu đề công việc không được để trống!");
      return;
    }
    onSubmit(taskData); // Gửi toàn bộ object taskData về cho cha
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalTitle>{title}</ModalTitle>
        <StyledForm onSubmit={handleSubmit}>
          <StyledInput name="title" value={taskData.title} onChange={handleChange} placeholder="Task title" required autoFocus />
          <StyledTextarea name="description" value={taskData.description} onChange={handleChange} placeholder="Description (optional)" />
          <StyledSelect name="priority" value={taskData.priority} onChange={handleChange}>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </StyledSelect>
          <StyledInput name="dueDate" type="date" value={taskData.dueDate} onChange={handleChange} />
          <ButtonRow>
            <ModernButton type="submit" variant="primary">Save Task</ModernButton>
            <ModernButton type="button" onClick={onClose}>Cancel</ModernButton>
          </ButtonRow>
        </StyledForm>
      </ModalContent>
    </ModalOverlay>
  );
}

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
  margin: "0 auto",
  "::-webkit-scrollbar": {
    display: "none",
  },
  scrollbarWidth: "none",
  "@media (max-width: 1200px)": {
    width: "98vw",
    maxWidth: "98vw",
    margin: "0 auto", // Vẫn căn giữa
    position: "static",
    top: "0",
    left: "0",
    maxHeight: "60vh",
  },
  "@media (max-width: 700px)": {
    width: "100vw",
    minHeight: "auto",
    padding: "0.2rem",
    borderRadius: "8px",
  },
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
  "@media (max-width: 700px)": {
    fontSize: "28px",
    top: "20px",
    left: "10px",
  },
});

const SortButtonGroup = styled("div")({
  display: "flex",
  flkexDirection: "row",
  gap: "30px",
  marginTop: "320px",
  justifyContent: "center",
  left: "60px",
  zIndex: 2,
  "@media (max-width: 700px)": {
    gap: "10px",
    marginTop: "80px",
  },
});

const SortButton = styled("button")(({ selected }) => ({
  padding: "10px 20px",
  borderRadius: "25px",
  fontSize: "30px",
  fontWeight: "550",
  background: selected ? "#164a41" : "#FFF",
  color: selected ? "#ffffffff" : "#164a41",
  border: selected ? "none" : "5px solid #164a41",
  transition: "background 0.2s, border 0.4s",
  '&:active': {
    transform: 'scale(0.9)' // Thêm hiệu ứng nhấn nút
  },
  "@media (max-width: 700px)": {
    fontSize: "18px",
    padding: "6px 10px",
    borderRadius: "16px",
  },
}));

const TaskManagerContainer = styled("div")({
  display: "block",
  padding: 0,
  boxSizing: "border-box",
  width: "1024px",
  maxHeight: "calc(100vh - 420px)",
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
  height: `278px`,
  width: `1072px`,
  position: `absolute`,
  left: `0px`,
  top: `125px`,
  "@media (max-width: 1200px)": {
    width: "96vw",
    height: "auto",
    top: "90px",
  },
  "@media (max-width: 700px)": {
    width: "100vw",
    height: "auto",
    top: "60px",
  },
});

function TaskExplorer() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSort, setSelectedSort] = useState("All tasks");
  
  // State để quản lý Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // Lưu task đang sửa

  const accountId = localStorage.getItem('accountId');
  const sortOptions = ["All tasks", "Priority", "Due date"];
  const sortApiMap = { "All tasks": "createdAt", "Priority": "priority", "Due date": "dueDate" };

  const fetchTasks = useCallback(async (sortByValue) => {
    if (!accountId) {
      setError("Can't find account. Please try reloading the page.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const apiSortKey = sortApiMap[sortByValue];
      // Thay đổi URL để gọi đến /api/tasks
      const response = await fetch(`http://localhost:5000/api/tasks?sortBy=${apiSortKey}&isCompleted=false`, {
        headers: { 'x-account-id': accountId },
      });
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    };
  }, [accountId]);

  useEffect(() => {
    fetchTasks(selectedSort);
  }, [selectedSort, fetchTasks]);

  const handleSaveTask = async (taskData) => {
    const isEditing = !!editingTask;
    
    const url = isEditing
      ? `http://localhost:5000/api/tasks/${editingTask._id}`
      : 'http://localhost:5000/api/tasks';

    const method = isEditing ? 'PUT' : 'POST';

    // Xử lý dueDate rỗng
    const body = {
        ...taskData,
        dueDate: taskData.dueDate ? taskData.dueDate : null
    };

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'x-account-id': accountId },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('Thao tác thất bại');
      fetchTasks(selectedSort);
    } catch (err) {
      alert(`Lỗi: ${err.message}`);
    }
  };

  // --- HÀM XỬ LÝ XÓA ---
  // const handleDeleteTask = async (taskId) => {
  //     if (window.confirm("Bạn có chắc chắn muốn xóa công việc này?")) {
  //         try {
  //             const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
  //                 method: 'DELETE',
  //                 headers: { 'x-account-id': accountId }
  //             });
  //             if (!response.ok) throw new Error('Không thể xóa công việc');
  //             fetchTasks(selectedSort); // Tải lại danh sách
  //         } catch (err) {
  //             alert(`Lỗi: ${err.message}`);
  //         }
  //     }
  // };
  
  // --- CÁC HÀM ĐIỀU KHIỂN MODAL ---
  const openAddModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <>
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
          <Button label="+ New task" onClick={openAddModal} />
        </div>

        <TaskMenu as='svg'xmlns="http://www.w3.org/2000/svg" width="1076" height="283" viewBox="0 0 1076 283" fill="none">
        <path d="M1023 1.5C1051.44 1.5 1074.5 24.5573 1074.5 53V230C1074.5 258.443 1051.44 281.5 1023 281.5H53C24.5573 281.5 1.5 258.443 1.5 230V53C1.5 24.5573 24.5573 1.5 53 1.5H1023Z" fill="#FFF6F6" stroke="#164a41" stroke-width="3"/>
        </TaskMenu> 
      <TaskManagerContainer>
        {isLoading && <div>Loading tasks...</div>}
            {error && <div>Error: {error}</div>}
            {!isLoading && !error && tasks.map((task) => (
              <TaskFrame 
                key={task._id} 
                task={task}
                onEdit={openEditModal}
                // onDelete={() => handleDeleteTask(task._id)} // <-- Thêm vào nút xóa sau này
              />
            ))}
            {!isLoading && !error && tasks.length === 0 && <div>Không có công việc nào.</div>}
      </TaskManagerContainer>
      </TaskMainContent>
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveTask}
        initialTask={editingTask}
        title={editingTask ? 'Edit task' : 'Create new task'}
      />
    </>
  );  
}

export default TaskExplorer;