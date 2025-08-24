import React, { useState, useEffect, useCallback } from 'react';

export default function Reminders() {
    // State để lưu danh sách các công việc
    const [tasks, setTasks] = useState([]);
    // State để quản lý trạng thái tải dữ liệu
    const [isLoading, setIsLoading] = useState(true);
    // State để lưu trữ lỗi nếu có
    const [error, setError] = useState(null);

    // Lấy accountId từ localStorage, giống như trong Task.jsx
    const accountId = localStorage.getItem('accountId');

    const fetchTasks = useCallback(async () => {
        // Nếu không có accountId, không thực hiện fetch
        if (!accountId) {
            setError("Chưa đăng nhập hoặc không tìm thấy tài khoản.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            // Xây dựng URL với các tham số query cần thiết:
            // - isCompleted=false: Chỉ lấy task chưa hoàn thành.
            // - sortBy=dueDate: Sắp xếp theo ngày hết hạn gần nhất (đã xử lý ở backend).
            const response = await fetch(`http://localhost:5000/api/tasks?isCompleted=false&sortBy=dueDate`, {
                headers: {
                    // Gửi header 'x-account-id' để backend xác thực
                    'x-account-id': accountId
                },
            });

            if (!response.ok) {
                throw new Error('Không thể tải dữ liệu công việc');
            }
            
            const data = await response.json();
            setTasks(data); // Cập nhật danh sách công việc
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [accountId]); // Phụ thuộc vào accountId

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleToggleComplete = async (taskId, currentStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-account-id': accountId,
                },
                body: JSON.stringify({ isCompleted: !currentStatus }),
            });

            if (!response.ok) {
                throw new Error("Không thể cập nhật trạng thái công việc.");
            }

            // Sau khi update xong, fetch lại danh sách
            fetchTasks();
        } catch (err) {
            setError(err.message);
        }
    };

    if (isLoading) {
        return (
            <div className="reminders">
                <h3>Reminder:</h3>
                <p>Đang tải...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="reminders">
                <h3>Reminder:</h3>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="reminders">
            <h3>Reminder:</h3>
            {tasks.length > 0 ? (
                <ul>
                    {tasks.map((task) => (
                        <li key={task._id}>
                            <input
                                type="checkbox"
                                checked={task.isCompleted}
                                onChange={() => handleToggleComplete(task._id, task.isCompleted)}
                            />
                            {task.title}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Không có công việc nào chưa hoàn thành.</p>
            )}
        </div>
    );
}
