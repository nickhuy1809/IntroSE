import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PomodoroSettingsModal({ isOpen, onClose, onSave, initialSettings, onTasksSelected }) {
    const [settings, setSettings] = useState(initialSettings);
    const [activeTab, setActiveTab] = useState('timer'); // 'timer' or 'tasks'
    const [availableTasks, setAvailableTasks] = useState([]);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [currentTask, setCurrentTask] = useState({
        name: '',
        estimatedPomodoros: 1,
        priority: 'Medium',
        description: ''
    });
    const navigate = useNavigate();

    const handleViewTaskPage = () => {
        onClose(); // Close the modal
        navigate('/task'); // Navigate to the task page
    };

    // Fetch available tasks when modal opens
    useEffect(() => {
        if (isOpen) {
            // change the tasks here, currently is temp
            const dummyTasks = [
                { id: 1, name: 'Study for Math Exam', priority: 'High', description: 'Review chapters 1-5', dueDate: '2025-08-10' },
                { id: 2, name: 'Write English Essay', priority: 'Medium', description: 'On Shakespeare\'s Macbeth', dueDate: '2025-08-15' },
                { id: 3, name: 'Physics Problem Set', priority: 'High', description: 'Complete all odd-numbered problems', dueDate: '2025-08-05' },
                { id: 4, name: 'Read History Chapter', priority: 'Low', description: 'Chapter 10: World War II', dueDate: '2025-08-12' },
                { id: 5, name: 'Complete Programming Project', priority: 'High', description: 'Build a React app', dueDate: '2025-08-20' },
                { id: 6, name: 'Research for Economics', priority: 'Medium', description: 'Gather sources for term paper', dueDate: '2025-08-18' }
            ];
            setAvailableTasks(dummyTasks);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(settings);
        if (onTasksSelected && selectedTasks.length > 0) {
            onTasksSelected(selectedTasks);
        }
        onClose();
    };

    // Option values for the settings
    const workOptions = [
        { value: 25, label: "25 mins" },
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
        const taskIndex = selectedTasks.findIndex(t => t.id === task.id);
        if (taskIndex >= 0) {
            // Task is already selected, remove it
            const newSelectedTasks = [...selectedTasks];
            newSelectedTasks.splice(taskIndex, 1);
            setSelectedTasks(newSelectedTasks);
        } else {
            // Task is not selected, add it
            setSelectedTasks([...selectedTasks, { 
                ...task,
                estimatedPomodoros: 1, // Default to 1 pomodoro session
                completed: false
            }]);
        }
    };

    const handleEstimateChange = (taskId, pomodoros) => {
        setSelectedTasks(selectedTasks.map(task => 
            task.id === taskId ? { ...task, estimatedPomodoros: pomodoros } : task
        ));
    };

    const addNewTask = () => {
        if (currentTask.name.trim()) {
            const newTask = {
                id: Date.now(), // Simple unique ID
                name: currentTask.name,
                priority: currentTask.priority,
                description: currentTask.description,
                estimatedPomodoros: currentTask.estimatedPomodoros,
                completed: false
            };
            setSelectedTasks([...selectedTasks, newTask]);
            setCurrentTask({
                name: '',
                estimatedPomodoros: 1,
                priority: 'Medium',
                description: ''
            });
        }
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
                                                type="checkbox"
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
                                                type="checkbox"
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
                                                type="checkbox"
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
                                                type="checkbox"
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
                                        <div key={task.id} className="po-task-item">
                                            <div className="po-task-left">
                                                <label className="po-task-option">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedTasks.some(t => t.id === task.id)}
                                                        onChange={() => handleTaskSelection(task)}
                                                    />
                                                    <span className="po-checkbox"></span>
                                                </label>
                                                <div className="po-task-details">
                                                    <span className={`po-priority-tag ${task.priority.toLowerCase()}`}>{task.priority}</span>
                                                    <span className="po-task-name">{task.name}</span>
                                                    {task.description && <p className="po-task-description">{task.description}</p>}
                                                </div>
                                            </div>
                                            {selectedTasks.some(t => t.id === task.id) && (
                                                <div className="po-task-estimate">
                                                    <label>Pomodoros:</label>
                                                    <select 
                                                        value={selectedTasks.find(t => t.id === task.id).estimatedPomodoros}
                                                        onChange={(e) => handleEstimateChange(task.id, parseInt(e.target.value))}
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
                                <div className="po-add-task-form">
                                    <h3>Add New Task</h3>
                                    <div className="po-form-group">
                                        <input
                                            type="text"
                                            placeholder="Task name"
                                            value={currentTask.name}
                                            onChange={(e) => setCurrentTask({...currentTask, name: e.target.value})}
                                        />
                                    </div>
                                    <div className="po-form-group po-form-row">
                                        <select
                                            value={currentTask.priority}
                                            onChange={(e) => setCurrentTask({...currentTask, priority: e.target.value})}
                                        >
                                            <option value="High">High Priority</option>
                                            <option value="Medium">Medium Priority</option>
                                            <option value="Low">Low Priority</option>
                                        </select>
                                        <select
                                            value={currentTask.estimatedPomodoros}
                                            onChange={(e) => setCurrentTask({...currentTask, estimatedPomodoros: parseInt(e.target.value)})}
                                        >
                                            {[1, 2, 3, 4, 5].map(num => (
                                                <option key={num} value={num}>{num} Pomodoros</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="po-form-group">
                                        <textarea
                                            placeholder="Task description (optional)"
                                            value={currentTask.description}
                                            onChange={(e) => setCurrentTask({...currentTask, description: e.target.value})}
                                            rows="2"
                                        />
                                    </div>
                                    <button type="button" className="po-add-task-btn" onClick={addNewTask}>
                                        Add Task
                                    </button>
                                </div>
                            </div>
                            <div className="po-selected-tasks">
                                <h3>Selected Tasks ({selectedTasks.length})</h3>
                                <div className="po-tasks-list">
                                    {selectedTasks.map((task, index) => (
                                        <div key={task.id} className="po-selected-task-item">
                                            <div className="po-task-left">
                                                <div className="po-task-details">
                                                    <span className={`po-priority-tag ${task.priority.toLowerCase()}`}>{task.priority}</span>
                                                    <span className="po-task-name">{task.name}</span>
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
                    
                    <button type="submit" className="po-save-btn">
                        Save & close
                    </button>
                </form>
            </div>
        </div>
    );
}
