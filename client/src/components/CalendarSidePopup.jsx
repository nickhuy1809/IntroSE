import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import './css/CalendarSidePopup.css';

export default function CalendarSidePopup({ 
  isOpen, 
  onClose, 
  selectedSlot, 
  onSave, 
  onDelete,
  style, 
  editMode = false,
  eventData = null 
}) {
  const [activeTab, setActiveTab] = useState('event');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'High',
    type: 'event',
    tasks: []
  });

  // Update form data when editing an existing event
  useEffect(() => {
    if (editMode && eventData) {
      setFormData({
        ...eventData,
        tasks: eventData.tasks || []
      });
    } else {
      // Reset form when creating new event
      setFormData({
        title: '',
        description: '',
        priority: 'High',
        type: 'event',
        tasks: []
      });
    }
  }, [editMode, eventData]);
  
  const [currentTask, setCurrentTask] = useState({
    name: '',
    priority: 'High',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      start: selectedSlot?.start,
      end: selectedSlot?.end,
      type: activeTab
    });
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const tabs = [
    { id: 'event', label: 'Event' },
    { id: 'task', label: 'Task' },
    { id: 'focus', label: 'Focus Time' }
  ];

  return (
    <div className={`calendar-side-popup ${isOpen ? 'open' : ''}`} style={style}>
      <div className="popup-header">
        <button className="close-button" onClick={onClose}>&times;</button>
        <div className="tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="popup-content">
        <div className="time-info">
          <div className="date">
            {format(selectedSlot?.start || new Date(), 'EEEE, MMMM d, yyyy')}
          </div>
          <div className="time-range">
            {format(selectedSlot?.start || new Date(), 'h:mm a')} - 
            {format(selectedSlot?.end || new Date(), 'h:mm a')}
          </div>
        </div>

        {activeTab === 'event' && (
          <div className="tab-content">
            <div className="form-group">
              <input
                type="text"
                name="title"
                placeholder="Add title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        )}

        {activeTab === 'task' && (
          <div className="tab-content">
            <div className="form-group">
              <input
                type="text"
                name="title"
                placeholder="Event name"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="tasks-section">
              <h3>Associated Tasks</h3>
              {formData.tasks.map((task, index) => (
                <div key={index} className="task-item">
                  <div className="task-header">
                    <span className={`priority-tag ${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                    <span className="task-name">{task.name}</span>
                    <button
                      type="button"
                      className="delete-task"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          tasks: formData.tasks.filter((_, i) => i !== index)
                        });
                      }}
                    >
                      ×
                    </button>
                  </div>
                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}
                </div>
              ))}
              
              <div className="add-task-form">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="New task name"
                    value={currentTask.name}
                    onChange={(e) => setCurrentTask({
                      ...currentTask,
                      name: e.target.value
                    })}
                  />
                </div>
                <div className="form-group">
                  <select
                    value={currentTask.priority}
                    onChange={(e) => setCurrentTask({
                      ...currentTask,
                      priority: e.target.value
                    })}
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
                <div className="form-group">
                  <textarea
                    placeholder="Task description"
                    value={currentTask.description}
                    onChange={(e) => setCurrentTask({
                      ...currentTask,
                      description: e.target.value
                    })}
                    rows="2"
                  />
                </div>
                <button
                  type="button"
                  className="add-task-button"
                  onClick={() => {
                    if (currentTask.name.trim()) {
                      setFormData({
                        ...formData,
                        tasks: [...formData.tasks, { ...currentTask }]
                      });
                      setCurrentTask({
                        name: '',
                        priority: 'High',
                        description: ''
                      });
                    }
                  }}
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'focus' && (
          <div className="tab-content focus-time">
            <p>Focus time session</p>
            <p className="focus-description">
              Block this time for focused work without interruptions
            </p>
          </div>
        )}

        <div className="popup-actions">
          {editMode && (
            <button 
              type="button" 
              className="delete-button"
              onClick={(e) => {
                e.preventDefault();
                if (window.confirm('Are you sure you want to delete this event?')) {
                  onDelete();
                }
              }}
            >
              Delete
            </button>
          )}
          <button type="submit" className="save-button">
            {editMode ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
