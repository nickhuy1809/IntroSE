import React, { useState } from 'react';

export default function PomodoroSettingsModal({ isOpen, onClose, onSave, initialSettings }) {
    const [settings, setSettings] = useState(initialSettings);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(settings);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Pomodoro Settings</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="sessionTime">Session Time (minutes)</label>
                        <input
                            type="number"
                            id="sessionTime"
                            value={settings.sessionTime}
                            onChange={(e) => setSettings({ ...settings, sessionTime: parseInt(e.target.value) })}
                            min="1"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="shortBreak">Short Break (minutes)</label>
                        <input
                            type="number"
                            id="shortBreak"
                            value={settings.shortBreak}
                            onChange={(e) => setSettings({ ...settings, shortBreak: parseInt(e.target.value) })}
                            min="1"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="longBreak">Long Break (minutes)</label>
                        <input
                            type="number"
                            id="longBreak"
                            value={settings.longBreak}
                            onChange={(e) => setSettings({ ...settings, longBreak: parseInt(e.target.value) })}
                            min="1"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="numSessions">Number of Sessions</label>
                        <input
                            type="number"
                            id="numSessions"
                            value={settings.numSessions}
                            onChange={(e) => setSettings({ ...settings, numSessions: parseInt(e.target.value) })}
                            min="1"
                            required
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-cancel">
                            Cancel
                        </button>
                        <button type="submit" className="btn-save">
                            Save Settings
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
