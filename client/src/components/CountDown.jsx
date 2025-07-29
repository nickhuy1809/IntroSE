import React, { useState, useEffect } from 'react';
import PomodoroSettingsModal from './PomodoroSettingsModal';

export default function CountdownTimer({ initialSeconds = 60, offsetX = 0 }) {
    const [time, setTime] = useState(initialSeconds);
    const [isRunning, setIsRunning] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [currentSession, setCurrentSession] = useState(1);
    const [isBreak, setIsBreak] = useState(false);
    const [settings, setSettings] = useState({
        sessionTime: 25,
        shortBreak: 5,
        longBreak: 15,
        numSessions: 4
    });

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
                            // Current session finished
                            const nextSession = currentSession + 1;
                            const midPoint = Math.ceil(settings.numSessions / 2);
                            
                            if (currentSession === midPoint) {
                                // Time for long break
                                setTime(settings.longBreak * 60);
                            } else {
                                // Time for short break
                                setTime(settings.shortBreak * 60);
                            }
                            setCurrentSession(nextSession);
                            setIsBreak(true);
                        } else {
                            // Break finished
                            if (currentSession <= settings.numSessions) {
                                setTime(settings.sessionTime * 60);
                                setIsBreak(false);
                            }
                        }
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, time, currentSession, isBreak, settings]);

    const toggleTimer = () => {
        if (time > 0) setIsRunning(!isRunning);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTime(initialSeconds);
    };

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="timer-container" style={{ '--timer-offset': `${offsetX}px` }}>
            <div className="timer-display">
                {formatTime(time)}
            </div>
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
                    disabled={time === 0}
                    aria-label="Start Countdown"
                >
                    <div className="triangle-icon"></div>
                </button>
            </div>
        </div>
    );
}
