import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, setHours, setMinutes } from 'date-fns';
import CalendarSidePopup from './CalendarSidePopup';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './css/ScheduleCalendar.css';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }), // Start week on Sunday
  getDay,
  locales,
});

export default function ScheduleCalendar({ defaultView = 'week', availableViews = ['week', 'month'] }) {
  const [events, setEvents] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [previewEvent, setPreviewEvent] = useState(null);
  const [popupPosition, setPopupPosition] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Check if a time slot overlaps with existing events
  const checkOverlap = (start, end) => {
    return events.some(event => {
      return (
        (start >= event.start && start < event.end) ||
        (end > event.start && end <= event.end) ||
        (start <= event.start && end >= event.end)
      );
    });
  };

  const handleSelectSlot = ({ start, end, bounds }) => {
    // Check for overlapping events
    if (checkOverlap(start, end)) {
      alert('This time slot overlaps with an existing event. Please choose a different time.');
      return;
    }

    // Close previous selection if exists
    if (selectedSlot && !showModal) {
      setSelectedSlot(null);
      setPreviewEvent(null);
    }

    // Reset editing state
    setIsEditing(false);
    setSelectedEvent(null);

    // Calculate popup position using bounds provided by react-big-calendar
    if (bounds) {
      const calendarElement = document.querySelector('.schedule-calendar');
      const calendarRect = calendarElement.getBoundingClientRect();

      // Calculate popup position relative to the calendar container
      const left = bounds.right + 10; // 10px gap between event and popup
      const top = bounds.top - calendarRect.top;

      setPopupPosition({ top, left });
    }

    setSelectedSlot({ start, end });
    setShowModal(true);
    
    // Create preview event
    setPreviewEvent({
      title: 'New Event',
      start,
      end,
      type: 'event',
      preview: true
    });
  };

  const handleSaveEvent = (eventDetails) => {
    // Handle editing existing event
    if (isEditing && selectedEvent) {
      const updatedEvents = events.map(event =>
        event === selectedEvent ? { ...eventDetails, allDay: false } : event
      );
      setEvents(updatedEvents);
    } else {
      // Create new event
      const newEvent = {
        ...eventDetails,
        allDay: false
      };

      // Create tasks in the Tasks page
      if (eventDetails.tasks && eventDetails.tasks.length > 0) {
        eventDetails.tasks.forEach(task => {
          const newTask = {
            name: task.name,
            priority: task.priority,
            description: task.description,
            due: eventDetails.end,
            relatedEvent: eventDetails.title
          };
          console.log('Created task:', newTask);
        });
      }

      setEvents([...events, newEvent]);
    }

    // Reset states
    setPreviewEvent(null);
    setShowModal(false);
    setIsEditing(false);
    setSelectedEvent(null);
  };

  const handleClosePopup = () => {
    setShowModal(false);
    setPreviewEvent(null);
    setSelectedSlot(null);
    setIsEditing(false);
    setSelectedEvent(null);
  };

  const handleEventSelect = (event) => {
    // Don't allow editing preview events
    if (event.preview) return;

    const element = document.querySelector(`[title="${event.title}"]`);
    if (element) {
      const bounds = element.getBoundingClientRect();
      const calendarElement = document.querySelector('.schedule-calendar');
      const calendarRect = calendarElement.getBoundingClientRect();

      setPopupPosition({
        top: bounds.top - calendarRect.top,
        left: bounds.right + 10
      });
    }

    setSelectedEvent(event);
    setIsEditing(true);
    setSelectedSlot({ start: event.start, end: event.end });
    setShowModal(true);
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      // Filter out the selected event using more reliable comparison
      const updatedEvents = events.filter(event => {
        // Compare timestamps and title to ensure we remove the correct event
        return !(
          event.title === selectedEvent.title &&
          event.start.getTime() === selectedEvent.start.getTime() &&
          event.end.getTime() === selectedEvent.end.getTime()
        );
      });
      
      setEvents(updatedEvents);
      handleClosePopup(); // This will reset all states
    }
  };

  const eventStyleGetter = (event) => {
    const colors = {
      event: '#4F7942',
      task: '#ff6b35',
      focus: '#5b7c5b'
    };

    return {
      style: {
        backgroundColor: colors[event.type] || '#4F7942',
        borderRadius: '2px',
        opacity: event.preview ? 0.5 : 0.8,
        color: 'white',
        border: event.preview ? '4px dashed #4F7942' : 'none',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',      
        boxSizing: 'border-box',
      }
    };
  };

  return (
    <div className="schedule-calendar">
      <Calendar
        localizer={localizer}
        events={[...events, ...(previewEvent ? [previewEvent] : [])]}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100vh - 100px)' }}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleEventSelect}
        min={setHours(setMinutes(new Date(), 0), 6)} // Start at 7 AM
        max={setHours(setMinutes(new Date(), 0), 23)} // End at 7 PM
        step={30} // 30-minute intervals
        timeslots={2}
        defaultView={defaultView}
        views={{
          month: true,
          week: true,
        }}
        toolbar={true}
        eventPropGetter={eventStyleGetter}
        formats={{
          timeGutterFormat: (date) => format(date, 'h:mm a'),
          eventTimeRangeFormat: ({ start, end }, culture, local) =>
            `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`,
        }}
      />
      <CalendarSidePopup
        isOpen={showModal}
        onClose={handleClosePopup}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        selectedSlot={selectedSlot}
        editMode={isEditing}
        eventData={selectedEvent}
        style={popupPosition ? {
          position: 'absolute',
          top: `${popupPosition.top}px`,
          left: `${popupPosition.left}px`
        } : undefined}
      />
    </div>
  );
}