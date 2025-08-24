import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { useLocalStorage } from '../hooks/useLocalStorage';
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
  const [events, setEvents] = useLocalStorage('calendar_events', []);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [previewEvent, setPreviewEvent] = useState(null);
  const [popupPosition, setPopupPosition] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleNavigate = (action) => {
    const newDate = new Date(currentDate);
    switch (action) {
      case 'PREV':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'NEXT':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'TODAY':
        newDate.setTime(new Date().getTime());
        break;
    }
    setCurrentDate(newDate);
  };

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
      const scrollTop = calendarElement.scrollTop;
      const scrollLeft = calendarElement.scrollLeft;

      // Calculate popup position relative to the calendar container, accounting for scroll
      const left = Math.min(
        bounds.right - scrollLeft + 10, // 10px gap between event and popup
        calendarRect.width - 300 // ensure popup doesn't overflow horizontally
      );
      const top = Math.min(
        bounds.top + scrollTop - calendarRect.top,
        calendarRect.height - 400 // ensure popup doesn't overflow vertically
      );

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
    // Ensure start and end are Date objects
    const processedEventDetails = {
      ...eventDetails,
      start: new Date(eventDetails.start),
      end: new Date(eventDetails.end)
    };

    // Handle editing existing event
    if (isEditing && selectedEvent) {
      const updatedEvents = events.map(event =>
        event === selectedEvent ? { ...processedEventDetails, allDay: false } : event
      );
      setEvents(updatedEvents);
    } else {
      // Create new event
      const newEvent = {
        ...processedEventDetails,
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
      event: '#4d774e',
      task: '#f1b24a',
      focus: '#aead5eff'
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
        height: 'auto',  
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
        style={{ minHeight: '500px', height: 'auto', overflowY: 'auto' }}
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
        date={currentDate}
        onNavigate={handleNavigate}
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