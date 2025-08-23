import React, { useState, useEffect, useCallback, useRef } from 'react';
import PomodoroSettingsModal from './PomodoroSettingsModal';
import { ReactComponent as SettingsIcon } from '../img/Settings.svg';
import { ReactComponent as CheckIcon } from '../img/Task.svg';

export default function CountdownTimer({ offsetX = 0 }) {
    // --- STATE MANAGEMENT ---
    const [settings, setSettings] = useState({ sessionTime: 25, shortBreak: 5, longBreak: 15, numSessions: 4 });
    const [time, setTime] = useState(25 * 60); 
    const [isRunning, setIsRunning] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [breakType, setBreakType] = useState('short');
    const [activeSession, setActiveSession] = useState(null);
    const [sessionTasks, setSessionTasks] = useState([]);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(-1);
    
    // State flag để ra tín hiệu bắt đầu xử lý
    const [isProcessing, setIsProcessing] = useState(false);
    
    const accountId = localStorage.getItem('accountId');
    const currentTaskInSession = currentTaskIndex > -1 ? sessionTasks[currentTaskIndex] : null;

    // Ref "khóa" để ngăn useEffect chạy logic hai lần trong Strict Mode
    const processingLock = useRef(false);

    // --- LOGIC EFFECTS ---

    // 1. useEffect: Lấy cài đặt ban đầu
    useEffect(() => {
        if (!accountId) return;
        const fetchInitialSettings = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/pomodoro/settings', { headers: { 'x-account-id': accountId } });
                if (response.ok) {
                    const data = await response.json();
                    const initialSettings = {
                        sessionTime: data.workDuration, shortBreak: data.shortBreakDuration,
                        longBreak: data.longBreakDuration, numSessions: data.pomodorosPerCycle
                    };
                    setSettings(initialSettings);
                    if (!isRunning && !isBreak && !activeSession) {
                        setTime(initialSettings.sessionTime * 60);
                    }
                }
            } catch (error) { console.error("Không thể tải cài đặt ban đầu:", error); }
        };
        fetchInitialSettings();
    }, [accountId, isRunning, isBreak, activeSession]);

    // 2. useEffect: Đếm ngược VÀ kích hoạt xử lý
    useEffect(() => {
        let interval = null;
        if (isRunning && time > 0) {
            interval = setInterval(() => setTime(prevTime => prevTime - 1), 1000);
        } else if (isRunning && time === 0) {
            setIsRunning(false);
            if (!isBreak) {
                // Chỉ ra tín hiệu cần xử lý, không làm gì khác
                setIsProcessing(true);
            }
        }
        return () => clearInterval(interval);
    }, [isRunning, time, isBreak]);

    // 3. useEffect: CHUYÊN XỬ LÝ tác vụ bất đồng bộ (An toàn với Strict Mode)
    useEffect(() => {
        // Chỉ chạy khi có tín hiệu VÀ chưa bị khóa
        if (isProcessing && !processingLock.current) {
            // Khóa lại ngay lập tức
            processingLock.current = true;

            const runEndOfPomodoroSequence = async () => {
                try {
                    if (!activeSession || !currentTaskInSession) return;

                    const response = await fetch(`http://localhost:5000/api/pomodoro/sessions/${activeSession._id}/tasks/${currentTaskInSession._id}/increment`, {
                        method: 'PUT',
                        headers: { 'x-account-id': accountId },
                    });
                    if (!response.ok) throw new Error('Lỗi ghi nhận Pomodoro');
                    
                    const updatedSession = await response.json();
                    
                    setActiveSession(updatedSession);
                    const newSessionTasks = normalizeSessionTasks(updatedSession);
                    setSessionTasks(newSessionTasks);

                    const finishedTaskInfo = newSessionTasks.find(t => t._id === currentTaskInSession._id);
                    if (finishedTaskInfo) {
                        const totalActualPomodoros = updatedSession.tasks.reduce((sum, task) => sum + task.actualPomodoros, 0);

                        if (totalActualPomodoros % settings.numSessions === 0) {
                            setBreakType('long');
                            setTime(settings.longBreak * 60);
                        } else {
                            setBreakType('short');
                            setTime(settings.shortBreak * 60);
                        }
                        setIsBreak(true);
                        setIsRunning(false);
                    }
                } catch (error) {
                    console.error("Lỗi khi kết thúc Pomodoro:", error.message);
                } finally {
                    // Mở khóa và tắt tín hiệu sau khi đã xử lý xong
                    processingLock.current = false;
                    setIsProcessing(false);
                }
            };
            runEndOfPomodoroSequence();
        }
    }, [isProcessing, activeSession, currentTaskInSession, accountId, settings]);

    // 4. useEffect: Xử lý khi hết giờ nghỉ
    useEffect(() => {
        if (time === 0 && isBreak) {
            setIsBreak(false);
            setTime(settings.sessionTime * 60);
            setIsRunning(false);
        }
    }, [time, isBreak, settings.sessionTime]);

    const normalizeSessionTasks = (session) =>
        session.tasks.map(st => ({
            ...st.task,
            estimatedPomodoros: st.estimatedPomodoros,
            actualPomodoros: st.actualPomodoros,
            status: st.status,
            _sessionTaskId: st._id, // giữ lại nếu cần
            _id: st.task._id,       // QUAN TRỌNG: luôn dùng id của task
        }));

    // --- EVENT HANDLERS ---
    const handleSessionStarted = (newSession, updatedSettings) => {
        const newSettings = {
            sessionTime: updatedSettings.workDuration, shortBreak: updatedSettings.shortBreakDuration,
            longBreak: updatedSettings.longBreakDuration, numSessions: updatedSettings.pomodorosPerCycle
        };
        setSettings(newSettings);
        setTime(newSettings.sessionTime * 60);
        setIsRunning(false);
        setIsBreak(false);
        if (newSession && newSession.tasks) {
            setActiveSession(newSession);
            const populatedTasks = normalizeSessionTasks(newSession);
            setSessionTasks(populatedTasks);
            const firstTaskIndex = populatedTasks.findIndex(t => t.status !== 'completed');
            setCurrentTaskIndex(firstTaskIndex > -1 ? firstTaskIndex : -1);
        } else {
            setActiveSession(null);
            setSessionTasks([]);
            setCurrentTaskIndex(-1);
        }
    };
    const handleCompleteTask = useCallback(async () => {
        if (!activeSession || !currentTaskInSession) return;
        const shouldCountCurrentPomodoro = (!isBreak && time > 0);
        setIsRunning(false);
        const taskElement = document.querySelector('.current-task-container');
        if (taskElement) taskElement.classList.add('task-completed');
        const taskIdBeingCompleted = currentTaskInSession._id;
        setTimeout(async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/pomodoro/sessions/${activeSession._id}/tasks/${taskIdBeingCompleted}/complete`, {
                    method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-account-id': accountId },
                    body: JSON.stringify({ incrementBeforeCompleting: shouldCountCurrentPomodoro })
                });
                if (!response.ok) throw new Error((await response.json()).message || 'Lỗi hoàn thành công việc');
                const result = await response.json();
                const successMessage = document.createElement('div');
                successMessage.className = 'task-success-message';
                successMessage.textContent = result.message;
                document.body.appendChild(successMessage);
                setTimeout(() => { if (document.body.contains(successMessage)) document.body.removeChild(successMessage); }, 2000);

                const updatedSessionFromServer = result.session;
                setActiveSession(updatedSessionFromServer);
                const updatedTasks = normalizeSessionTasks(updatedSessionFromServer);
                setSessionTasks(updatedTasks);
                
                const nextTaskIndex = updatedTasks.findIndex(task => task.status !== 'completed');
                if (nextTaskIndex !== -1) {
                    // Còn task → chuyển sang break
                    setCurrentTaskIndex(nextTaskIndex);

                    const completedTaskInfo = updatedTasks.find(t => t._id === taskIdBeingCompleted);
                    if (completedTaskInfo) {
                        const totalActualPomodoros = updatedSessionFromServer.tasks.reduce((sum, task) => sum + task.actualPomodoros, 0);
                        if (totalActualPomodoros % settings.numSessions === 0) {
                            setBreakType('long');
                            setTime(settings.longBreak * 60);
                        } else {
                            setBreakType('short');
                            setTime(settings.shortBreak * 60);
                        }
                        setIsBreak(true);
                        setIsRunning(false); // chờ Play
                    }
                } else {
                    // Không còn task → reset Pomodoro về trạng thái ban đầu
                    alert("Chúc mừng! Bạn đã hoàn thành tất cả công việc trong phiên này!");
                    setActiveSession(null);
                    setSessionTasks([]);
                    setCurrentTaskIndex(-1);
                    setIsBreak(false);
                    setTime(settings.sessionTime * 60);
                    setIsRunning(false);
                }
            } catch (error) {
                console.error("Lỗi:", error.message);
                alert(`Lỗi: ${error.message}`);
            } finally {
                if (taskElement) taskElement.classList.remove('task-completed');
            }
        }, 700);
    }, [activeSession, currentTaskInSession, isRunning, accountId, settings]);
    const toggleTimer = () => {
        if (!currentTaskInSession) return;
        setIsRunning(!isRunning);
    };
    const handleStopOrSkip = async () => {
        setIsRunning(false);

        if (isBreak) {
            // Kết thúc break sớm → sang work
            setIsBreak(false);
            setTime(settings.sessionTime * 60);
            return;
        }

        // Đang WORK, xử lý logic khi bấm nút vuông
        try {
            if (activeSession && currentTaskInSession && time > 0) {
                const res = await fetch(`http://localhost:5000/api/pomodoro/sessions/${activeSession._id}/tasks/${currentTaskInSession._id}/increment`, {
                    method: 'PUT',
                    headers: { 'x-account-id': accountId },
                });
                if (!res.ok) throw new Error('Lỗi khi ghi nhận Pomodoro');

                const updatedSession = await res.json();
                setActiveSession(updatedSession);
                const updatedTasks = normalizeSessionTasks(updatedSession);
                setSessionTasks(updatedTasks);

                // *** SỬA LỖI LOGIC: Kiểm tra tổng số Pomodoro của toàn bộ phiên từ dữ liệu mới nhất
                const totalActualPomodoros = updatedSession.tasks.reduce((sum, task) => sum + task.actualPomodoros, 0);

                if ((totalActualPomodoros % settings.numSessions) === 0) {
                    setBreakType('long');
                    setTime(settings.longBreak * 60);
                } else {
                    setBreakType('short');
                    setTime(settings.shortBreak * 60);
                }
                setIsBreak(true);
            }
        } catch (e) {
            console.error("Lỗi khi xử lý nút Stop/Skip:", e);
            // Fallback logic để UI không bị sai lệch
            const updated = [...sessionTasks];
            if (currentTaskIndex > -1) {
                updated[currentTaskIndex] = {
                    ...updated[currentTaskIndex],
                    actualPomodoros: (updated[currentTaskIndex].actualPomodoros || 0) + 1
                };
                setSessionTasks(updated);

                // Vẫn tính toán dựa trên dữ liệu local được cập nhật
                const totalActualPomodoros = updated.reduce((sum, task) => sum + task.actualPomodoros, 0);
                if ((totalActualPomodoros % settings.numSessions) === 0) {
                    setBreakType('long');
                    setTime(settings.longBreak * 60);
                } else {
                    setBreakType('short');
                    setTime(settings.shortBreak * 60);
                }
                setIsBreak(true);
            }
        }
    };
    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
     
    return (
        <div className="timer-container" style={{ '--timer-offset': `${offsetX}px` }}>
            <div className={`timer-status ${isBreak ? 'break-time' : 'work-time'}`}>
                {isBreak ? (breakType === 'long' ? 'Long Break' : 'Short Break') : 'Work Time'}
             </div>
            <div className="timer-display">
                {formatTime(time)}
            </div>
            <div className="session-info">
                {/* Session ${currentTaskInSession.actualPomodoros + 1} of {settings.numSessions} • {completedPomodoros} completed */}
                {isBreak && currentTaskInSession ? 
                    `Pomodoro #${currentTaskInSession.actualPomodoros} Complete!` 
                    :
                    (currentTaskInSession ? `Working on Pomodoro #${(currentTaskInSession.actualPomodoros || 0) + 1}` : 'Ready to begin')
                }
            </div>

            {currentTaskInSession && (
                <div className="current-task-container">
                    <div className="current-task-header">
                        <span className={`task-priority-tag ${currentTaskInSession.priority.toLowerCase()}`}>
                            {currentTaskInSession.priority}
                        </span>
                        <h3 className="current-task-name">{currentTaskInSession.title}</h3>
                        <div className="task-complete-container">
                            <label className="task-checkbox-label">
                                <input 
                                    type="checkbox"
                                    className="task-checkbox"
                                    onChange={handleCompleteTask}
                                    title="Mark task as complete"
                                    checked={currentTaskInSession.status === 'completed'}
                                    disabled={currentTaskInSession.status === 'completed'}
                                />
                                <span className="task-checkbox-custom">
                                    <CheckIcon className="task-checkbox-icon" />
                                </span>
                                <span className="task-complete-label">Mark done</span>
                            </label>
                        </div>
                    </div>
                    {currentTaskInSession.description && (
                        <p className="current-task-description">{currentTaskInSession.description}</p>
                    )}
                    {currentTaskInSession.dueDate && (
                        <div className="task-due-date">
                            Due: {new Date(currentTaskInSession.dueDate).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                            })}
                        </div>
                    )}
                    <div className="task-pomodoro-estimate">
                        <div className="task-progress-indicator">
                            <div className="task-progress-dots">
                                {Array.from({ length: Math.max(currentTaskInSession.estimatedPomodoros, currentTaskInSession.actualPomodoros) }).map((_, index) => {
                                    const isCompleted = index < currentTaskInSession.actualPomodoros;
                                    // Nếu là chấm "vượt mức", thêm một class 'overtime' để có thể tùy chỉnh CSS
                                    const isOvertime = index >= currentTaskInSession.estimatedPomodoros;
                                    return (
                                        <div 
                                            key={index} 
                                            className={`progress-dot ${isCompleted ? 'completed' : ''} ${isOvertime ? 'overtime' : ''}`}
                                        />
                                    );
                                })}
                            </div>
                            <span className="task-progress-text">
                                {currentTaskInSession.actualPomodoros} of {currentTaskInSession.estimatedPomodoros} pomodoros
                            </span>
                        </div>
                        <div className="next-task-hint">
                            {sessionTasks.filter(t => t.status !== 'completed').length > 1 && (
                                <span>
                                    Check the box to mark the task as done in order to move the next task
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="timer-controls">
                <button 
                    className={`timer-button stop ${isRunning ? 'active' : ''}`}
                    onClick={handleStopOrSkip}
                    aria-label="Reset Timer"
                >
                    <div className="square-icon"></div>
                </button>
                <button 
                    className={`timer-button start ${!isRunning ? 'active' : ''}`}
                    onClick={toggleTimer}
                    disabled={!currentTaskInSession}
                    aria-label="Start Countdown"
                >
                    <div className="triangle-icon"></div>
                </button>
                <button 
                    className={`timer-button settings ${isRunning ? 'disabled' : ''}`}
                    onClick={() => !isRunning && setShowSettings(true)}
                    disabled={isRunning}
                    aria-label="Pomodoro Settings"
                    title={isRunning ? "Settings cannot be changed during an active session" : "Pomodoro Settings"}
                >
                    <SettingsIcon />
                </button>
            </div>
            
            <PomodoroSettingsModal 
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                onSessionStarted={handleSessionStarted}
                // onSave={updatedSettings => setSettings(updatedSettings)}
                initialSettings={settings}
                // onTasksSelected={handleTasksSelected}
            />
        </div>
    );
}