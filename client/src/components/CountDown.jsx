import { useState, useEffect } from 'react';
import PomodoroSettingsModal from './PomodoroSettingsModal';
import { ReactComponent as SettingsIcon } from '../img/Settings.svg';
import { ReactComponent as CheckIcon } from '../img/Task.svg'; // Assuming this exists, or use another appropriate icon
import { usePomodoroTasks } from '../hooks/usePomodoroTasks';

export default function CountdownTimer({ offsetX = 0 }) {
    const [settings, setSettings] = useState({
        sessionTime: 25,
        shortBreak: 5,
        longBreak: 15,
        numSessions: 4
    });
    const [time, setTime] = useState(settings.sessionTime * 60); // Start with the full session time
    const [isRunning, setIsRunning] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [currentSession, setCurrentSession] = useState(1);
    const [isBreak, setIsBreak] = useState(false);
    const [completedPomodoros, setCompletedPomodoros] = useState(0);

    // Task management
    const { 
        getCurrentTask,
        setTaskList, 
        completeCurrentTask, 
        setCurrentTask,
        getAllTasks
    } = usePomodoroTasks();
    
    const currentTask = getCurrentTask();

    useEffect(() => {
        let interval;
        if (isRunning && time > 0) {
            interval = setInterval(() => {
                setTime(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(interval);
                        setIsRunning(false);
                        
                        // Handle session transitions
                        if (!isBreak) {
                            // Current work session finished
                            setCompletedPomodoros(prev => prev + 1);
                            const nextSession = currentSession + 1;
                            const midPoint = Math.ceil(settings.numSessions / 2);
                            
                            if (completedPomodoros + 1 >= settings.numSessions) {
                                // All pomodoros are complete
                                // Just stay at zero until user resets
                                return 0;
                            } else if (currentSession === midPoint) {
                                // Time for long break
                                setTime(settings.longBreak * 60);
                                setIsBreak(true);
                            } else {
                                // Time for short break
                                setTime(settings.shortBreak * 60);
                                setIsBreak(true);
                            }
                            setCurrentSession(nextSession);
                            return 0;
                        } else {
                            // Break finished
                            if (currentSession <= settings.numSessions) {
                                setTime(settings.sessionTime * 60);
                                setIsBreak(false);
                            }
                            return 0;
                        }
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, time, currentSession, isBreak, settings, completedPomodoros]);

    const toggleTimer = () => {
        if (time > 0) setIsRunning(!isRunning);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTime(settings.sessionTime * 60);
        setCurrentSession(1);
        setIsBreak(false);
        setCompletedPomodoros(0);
    };
    
    // Update timer when settings change
    useEffect(() => {
        if (!isRunning) {
            // Only update the timer if it's not running to avoid disrupting an active session
            if (isBreak) {
                if (currentSession === Math.ceil(settings.numSessions / 2)) {
                    setTime(settings.longBreak * 60);
                } else {
                    setTime(settings.shortBreak * 60);
                }
            } else {
                setTime(settings.sessionTime * 60);
            }
        }
    }, [settings, isRunning, isBreak, currentSession]);

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleTasksSelected = (tasks) => {
        setTaskList(tasks);
        if (tasks.length > 0) {
            setCurrentTask(0); // Set first task as current
        }
    };

    const handleCompleteTask = () => {
        // Provide feedback that the task is complete
        const taskElement = document.querySelector('.current-task-container');
        
        if (taskElement) {
            taskElement.classList.add('task-completed');
            
            // Display success message
            const successMessage = document.createElement('div');
            successMessage.className = 'task-success-message';
            successMessage.textContent = '✓ Task completed!';
            document.body.appendChild(successMessage);
            
            // Use setTimeout to wait for animation to complete before moving to next task
            setTimeout(() => {
                completeCurrentTask();
                taskElement.classList.remove('task-completed');
                
                // If timer is running, adjust the session state to account for task completion
                if (isRunning) {
                    // Increment completed pomodoros for proper tracking
                    setCompletedPomodoros(prev => prev + 1);
                }
                
                // Remove success message after a delay
                setTimeout(() => {
                    document.body.removeChild(successMessage);
                }, 1500);
            }, 700); // Match the animation duration (0.7s)
        } else {
            completeCurrentTask();
        }
    };    return (
        <div className="timer-container" style={{ '--timer-offset': `${offsetX}px` }}>
            <div className={`timer-status ${isBreak ? 'break-time' : 'work-time'}`}>
                {isBreak ? (currentSession === Math.ceil(settings.numSessions / 2) ? 'Long Break' : 'Short Break') : 'Work Time'}
             </div>
            <div className="timer-display">
                {formatTime(time)}
            </div>
            <div className="session-info">
                Session {currentSession} of {settings.numSessions} • {completedPomodoros} completed
            </div>

            {/* Current task display */}
            {currentTask && (
                <div className="current-task-container">
                    <div className="current-task-header">
                        <span className={`task-priority-tag ${currentTask.priority.toLowerCase()}`}>
                            {currentTask.priority}
                        </span>
                        <h3 className="current-task-name">{currentTask.name}</h3>
                        <div className="task-complete-container">
                            <label className="task-checkbox-label">
                                <input 
                                    type="checkbox"
                                    className="task-checkbox"
                                    onChange={handleCompleteTask}
                                    title="Mark task as complete"
                                />
                                <span className="task-checkbox-custom">
                                    <CheckIcon className="task-checkbox-icon" />
                                </span>
                                <span className="task-complete-label">Mark done</span>
                            </label>
                        </div>
                    </div>
                    {currentTask.description && (
                        <p className="current-task-description">{currentTask.description}</p>
                    )}
                    {currentTask.dueDate && (
                        <div className="task-due-date">
                            Due: {new Date(currentTask.dueDate).toLocaleDateString('en-US', { 
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
                                {Array.from({ length: currentTask.estimatedPomodoros }).map((_, index) => (
                                    <div 
                                        key={index} 
                                        className={`progress-dot ${index < completedPomodoros % (currentTask.estimatedPomodoros || 1) ? 'completed' : ''}`}
                                    />
                                ))}
                            </div>
                            <span className="task-progress-text">
                                {Math.min(completedPomodoros % (currentTask.estimatedPomodoros || 1), currentTask.estimatedPomodoros)} 
                                of {currentTask.estimatedPomodoros} pomodoros
                            </span>
                        </div>
                        <div className="next-task-hint">
                            {getAllTasks().length > 1 && (
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
                    onClick={resetTimer}
                    aria-label="Reset Timer"
                >
                    <div className="square-icon"></div>
                </button>
                <button 
                    className={`timer-button start ${!isRunning ? 'active' : ''}`}
                    onClick={toggleTimer}
                    disabled={time === 0 && completedPomodoros >= settings.numSessions}
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
                onSave={updatedSettings => setSettings(updatedSettings)}
                initialSettings={settings}
                onTasksSelected={handleTasksSelected}
            />
        </div>
    );
}
