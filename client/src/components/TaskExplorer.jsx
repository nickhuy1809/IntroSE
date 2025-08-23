import styled from "@emotion/styled";
import { useState, useEffect, useCallback } from 'react';
import TaskFrame from './TaskFrame';
import Button from '../components/Button';

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

  const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' };
  const modalContentStyle = { background: 'white', padding: '20px', borderRadius: '8px', width: '300px' };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input name="title" value={taskData.title} onChange={handleChange} placeholder="Tiêu đề công việc" required autoFocus />
          <textarea name="description" value={taskData.description} onChange={handleChange} placeholder="Mô tả (tùy chọn)" />
          
          <select name="priority" value={taskData.priority} onChange={handleChange}>
            <option value="high">Ưu tiên Cao</option>
            <option value="medium">Ưu tiên Trung bình</option>
            <option value="low">Ưu tiên Thấp</option>
          </select>
          
          <input name="dueDate" type="date" value={taskData.dueDate} onChange={handleChange} />
          
          <div>
            <button type="button" onClick={onClose}>Hủy</button>
            <button type="submit">Lưu Công việc</button>
          </div>
        </form>
      </div>
    </div>
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
      if (!response.ok) throw new Error('Không thể tải danh sách công việc');
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
        <path d="M1023 1.5C1051.44 1.5 1074.5 24.5573 1074.5 53V230C1074.5 258.443 1051.44 281.5 1023 281.5H53C24.5573 281.5 1.5 258.443 1.5 230V53C1.5 24.5573 24.5573 1.5 53 1.5H1023Z" fill="#FFF6F6" stroke="#58815F" stroke-width="3"/>
        </TaskMenu> 
      <TaskManagerContainer>
        {isLoading && <div>Đang tải công việc...</div>}
            {error && <div>Lỗi: {error}</div>}
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
        title={editingTask ? 'Chỉnh sửa công việc' : 'Tạo công việc mới'}
      />
    </>
  );  
}

export default TaskExplorer;