import React, { useState, useEffect } from 'react';
import CountdownTimer from '../components/CountDown';
import MusicPlayer from '../components/MusicPlayer';
import '../components/css/Pomodoro.css';

export default function Pomodoro() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1200);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1200);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className={`pomodoro-container ${isMobile ? 'mobile-layout' : ''}`}>
            <div className="timer-section">
                <CountdownTimer />
            </div>
            <div className="music-player-section">
                <MusicPlayer />
            </div>
        </div>
    );
}
