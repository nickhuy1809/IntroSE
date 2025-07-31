import React, { useState } from 'react';

export default function PomodoroSettingsModal({ isOpen, onClose, onSave, initialSettings }) {
    const [settings, setSettings] = useState(initialSettings);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(settings);
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

    return (
        <div className="po-modal-overlay">
            <div className="po-modal-content">
                <h2 className="po-modal-title">Po-menu</h2>
                <form onSubmit={handleSubmit} className="po-settings-form">
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
                    
                    <button type="submit" className="po-save-btn">
                        Save & close
                    </button>
                </form>
            </div>
        </div>
    );
}
