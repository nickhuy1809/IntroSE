import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PomodoroSettingsModal({ isOpen, onClose, initialSettings, onSessionStarted }) {
    const [settings, setSettings] = useState(initialSettings);
    const [activeTab, setActiveTab] = useState('timer');
    const [availableTasks, setAvailableTasks] = useState([]);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const accountId = localStorage.getItem('accountId');

    const handleViewTaskPage = () => {
        onClose(); // Close the modal
        navigate('/task'); // Navigate to the task page
    };

    // useEffect(() => {
    //     setSettings(initialSettings);
    // }, [initialSettings]);

    useEffect(() => {
        if (isOpen) {
            setSelectedTasks([]);
            setIsLoading(true);
            const fetchData = async () => {
                try {
                    // Lấy cài đặt Pomodoro
                    const settingsResponse = await fetch('http://localhost:5000/api/pomodoro/settings', {
                        headers: { 'x-account-id': accountId }
                    });
                    if (!settingsResponse.ok) throw new Error('Không thể tải cài đặt');
                    const settingsData = await settingsResponse.json();
                    const newSettings = {
                        sessionTime: settingsData.workDuration,
                        shortBreak: settingsData.shortBreakDuration,
                        longBreak: settingsData.longBreakDuration,
                        numSessions: settingsData.pomodorosPerCycle
                    };
                    setSettings(newSettings);

                    // Lấy danh sách task có sẵn
                    const tasksResponse = await fetch('http://localhost:5000/api/tasks?isCompleted=false', {
                        headers: { 'x-account-id': accountId }
                    });
                    if (!tasksResponse.ok) throw new Error('Không thể tải danh sách công việc');
                    const tasksData = await tasksResponse.json();
                    setAvailableTasks(tasksData);
                } catch (error) {
                    console.error("Lỗi khi tải dữ liệu:", error);
                    alert(`Lỗi khi tải dữ liệu: ${error.message}`);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        }
    }, [isOpen, accountId]);
    

    // Fetch available tasks when modal opens
    useEffect(() => {
        if (isOpen && activeTab === 'tasks') {
            setIsLoading(true);
            const fetchAvailableTasks = async () => {
                try {
                    const response = await fetch('http://localhost:5000/api/tasks?isCompleted=false', {
                        headers: { 'x-account-id': accountId }
                    });
                    if (!response.ok) throw new Error('Không thể tải danh sách công việc');
                    const data = await response.json();
                    setAvailableTasks(data); // <-- Dùng dữ liệu thật
                } catch (err) {
                    alert(err.message);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchAvailableTasks();
        }
    }, [isOpen, activeTab, accountId]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Gửi yêu cầu cập nhật cài đặt timer
            const settingsResponse = await fetch('http://localhost:5000/api/pomodoro/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-account-id': accountId },
                body: JSON.stringify({
                    workDuration: settings.sessionTime,
                    shortBreakDuration: settings.shortBreak,
                    longBreakDuration: settings.longBreak,
                    pomodorosPerCycle: settings.numSessions
                }),
            });
            if (!settingsResponse.ok) throw new Error('Lỗi cập nhật cài đặt');
            const updatedSettings = await settingsResponse.json();

            // Nếu có task được chọn, bắt đầu một phiên mới
            if (selectedTasks.length > 0) {
                const tasksForSession = selectedTasks.map(task => ({
                    taskId: task._id, // <-- Dùng _id từ MongoDB
                    estimatedPomodoros: task.estimatedPomodoros
                }));
                const sessionResponse = await fetch('http://localhost:5000/api/pomodoro/sessions/start', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'x-account-id': accountId },
                    body: JSON.stringify({ tasks: tasksForSession }),
                });
                if (!sessionResponse.ok) {
                    const errorData = await sessionResponse.json();
                    throw new Error(errorData.message || 'Lỗi bắt đầu phiên');
                }
                const newSession = await sessionResponse.json();
                onSessionStarted(newSession, updatedSettings); // Gửi phiên mới và cài đặt mới về cha
            } else {
                onSessionStarted(null, updatedSettings); // Chỉ gửi cài đặt mới về cha
            }
            onClose();
        } catch (err) {
            alert(`Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Option values for the settings
    const workOptions = [
        { value: 1, label: "1 mins" },
        { value: 30, label: "30 mins" },
        { value: 35, label: "35 mins" }
    ];

    const shortBreakOptions = [
        { value: 5, label: "5 mins" },
        { value: 8, label: "8 mins" },
        { value: 10, label: "10 mins" }
    ];

    const longBreakOptions = [
        { value: 15, label: "15 mins" },
        { value: 18, label: "18 mins" },
        { value: 20, label: "20 mins" }
    ];

    const pomodorosOptions = [
        { value: 2, label: "2" },
        { value: 3, label: "3" },
        { value: 4, label: "4" }
    ];

    const handleTaskSelection = (task) => {
        const isSelected = selectedTasks.some(t => t._id === task._id);
        if (isSelected) {
            setSelectedTasks(selectedTasks.filter(t => t._id !== task._id));
        } else {
            setSelectedTasks([...selectedTasks, { ...task, estimatedPomodoros: 1 }]);
        }
    };

    const handleEstimateChange = (taskId, pomodoros) => {
        setSelectedTasks(selectedTasks.map(task => 
            task._id === taskId ? { ...task, estimatedPomodoros: parseInt(pomodoros) } : task // <-- Dùng _id
        ));
    };

    return (
        <div className="po-modal-overlay">
            <div className="po-modal-content">
                <h2 className="po-modal-title">Po-menu</h2>
                
                <div className="po-tabs">
                    <button 
                        className={`po-tab ${activeTab === 'timer' ? 'active' : ''}`}
                        onClick={() => setActiveTab('timer')}
                    >
                        Timer Settings
                    </button>
                    <button 
                        className={`po-tab ${activeTab === 'tasks' ? 'active' : ''}`}
                        onClick={() => setActiveTab('tasks')}
                    >
                        Tasks
                    </button>
                    <button
                        className="po-view-all-tasks-btn"
                        onClick={handleViewTaskPage}
                        title="View all available tasks"
                    >
                        View All Tasks
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="po-settings-form">
                    {activeTab === 'timer' && (
                        <>
                            <div className="po-setting-row">
                                <div className="po-setting-label">Work duration</div>
                                <div className="po-option-group">
                                    {workOptions.map(option => (
                                        <label key={option.value} className="po-option">
                                            <input
                                                type="radio"
                                                name="workDuration"
                                                checked={settings.sessionTime === option.value}
                                                onChange={() => setSettings({ ...settings, sessionTime: option.value })}
                                            />
                                            <span className="po-checkbox"></span>
                                            {option.label}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="po-setting-row">
                                <div className="po-setting-label">Short break</div>
                                <div className="po-option-group">
                                    {shortBreakOptions.map(option => (
                                        <label key={option.value} className="po-option">
                                            <input
                                                type="radio"
                                                name="shortBreak"
                                                checked={settings.shortBreak === option.value}
                                                onChange={() => setSettings({ ...settings, shortBreak: option.value })}
                                            />
                                            <span className="po-checkbox"></span>
                                            {option.label}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="po-setting-row">
                                <div className="po-setting-label">Long break</div>
                                <div className="po-option-group">
                                    {longBreakOptions.map(option => (
                                        <label key={option.value} className="po-option">
                                            <input
                                                type="radio"
                                                name="longBreak"
                                                checked={settings.longBreak === option.value}
                                                onChange={() => setSettings({ ...settings, longBreak: option.value })}
                                            />
                                            <span className="po-checkbox"></span>
                                            {option.label}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="po-setting-row">
                                <div className="po-setting-label">Pomodoros</div>
                                <div className="po-option-group">
                                    {pomodorosOptions.map(option => (
                                        <label key={option.value} className="po-option">
                                            <input
                                                type="radio"
                                                name="pomodoros"
                                                checked={settings.numSessions === option.value}
                                                onChange={() => setSettings({ ...settings, numSessions: option.value })}
                                            />
                                            <span className="po-checkbox"></span>
                                            {option.label}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'tasks' && (
                        <div className="po-tasks-container">
                            <div className="po-tasks-available">
                                <h3>Available Tasks</h3>
                                <div className="po-tasks-list">
                                    {availableTasks.map(task => (
                                        <div key={task._id} className="po-task-item">
                                            <div className="po-task-left">
                                                <label className="po-task-option">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedTasks.some(t => t._id === task._id)}
                                                        onChange={() => handleTaskSelection(task)}
                                                    />
                                                    <span className="po-checkbox"></span>
                                                </label>
                                                <div className="po-task-details">
                                                    <span className={`po-priority-tag ${task.priority.toLowerCase()}`}>{task.priority}</span>
                                                    <span className="po-task-name">{task.title}</span>
                                                    {task.description && <p className="po-task-description">{task.description}</p>}
                                                </div>
                                            </div>
                                            {selectedTasks.some(t => t._id === task._id) && (
                                                <div className="po-task-estimate">
                                                    <label>Pomodoros:</label>
                                                    <select 
                                                        value={selectedTasks.find(t => t._id === task._id).estimatedPomodoros}
                                                        onChange={(e) => handleEstimateChange(task._id, parseInt(e.target.value))}
                                                    >
                                                        {[1, 2, 3, 4, 5].map(num => (
                                                            <option key={num} value={num}>{num}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="po-selected-tasks">
                                <h3>Selected Tasks ({selectedTasks.length})</h3>
                                <div className="po-tasks-list">
                                    {selectedTasks.map((task, index) => (
                                        <div key={task._id} className="po-selected-task-item">
                                            <div className="po-task-left">
                                                <div className="po-task-details">
                                                    <span className={`po-priority-tag ${task.priority.toLowerCase()}`}>{task.priority}</span>
                                                    <span className="po-task-name">{task.title}</span>
                                                </div>
                                            </div>
                                            <div className="po-task-estimate">
                                                <span>{task.estimatedPomodoros} {task.estimatedPomodoros === 1 ? 'Pomodoro' : 'Pomodoros'}</span>
                                                <button 
                                                    type="button" 
                                                    className="po-remove-task"
                                                    onClick={() => handleTaskSelection(task)}
                                                >×</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <button type="submit" className="po-save-btn" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save & close'}
                    </button>
                </form>
            </div>
        </div>
    );
}