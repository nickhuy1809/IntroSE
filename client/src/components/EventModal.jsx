import React, { useState } from 'react';
import { format } from 'date-fns';

export default function EventModal({ isOpen, onClose, onSave, selectedSlot }) {
  const [eventDetails, setEventDetails] = useState({
    title: '',
    location: '',
    start: selectedSlot?.start,
    end: selectedSlot?.end,
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(eventDetails);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Event Title</label>
            <input
              type="text"
              id="title"
              value={eventDetails.title}
              onChange={(e) => setEventDetails({ ...eventDetails, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location (Optional)</label>
            <input
              type="text"
              id="location"
              value={eventDetails.location}
              onChange={(e) => setEventDetails({ ...eventDetails, location: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Time</label>
            <div className="time-display">
              {format(selectedSlot?.start, 'h:mm a')} - {format(selectedSlot?.end, 'h:mm a')}
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-save">
              Save Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
