import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from '@emotion/styled';

const CalendarWrapper = styled.div`
  .react-calendar {
    background-color: #f5f6ef;
    border: none;
    padding: 0.5rem;
    font-family: 'Segoe UI', sans-serif;
    width: fit-content;
  }

  .react-calendar__navigation {
    display: none;
  }

  .react-calendar__month-view__weekdays {
    display: flex;
    justify-content: space-around;
    font-weight: bold;
    color: #2d3e2d;
    padding-bottom: 0.5rem;
  }

  .react-calendar__month-view__weekdays__weekday {
    width: 100px;
    text-align: center;
  }

  /* Hide all week rows */
  .react-calendar__month-view__days__day {
    display: none;
  }

  /* Show only visible week */
  .react-calendar__tile--week-visible {
    display: inline-block !important;
    width: 100px;
    text-align: center;
    visibility: visible;
    border-radius: 8px;
    padding: 0.4em;
    margin: 0px;
    cursor: pointer;
    /* Override disabled styles */
    background-color: #ffffff !important;
    color: #164a41 !important;
    opacity: 1 !important;
    border: 1px solid #dbe5d1;
  }

  .react-calendar__tile--now {
    background-color: #dbe5d1 !important;
    font-weight: bold;
    color: #2d3e2d !important;
  }

  .react-calendar__tile:disabled {
    background-color: #ffffff !important;
    color: #2d3e2d !important;
    opacity: 1 !important;
  }

  .react-calendar__tile:disabled.react-calendar__tile--week-visible {
    background-color: #ffffff !important;
    color: #2d3e2d !important;
    opacity: 1 !important;
  }

  .nav-buttons {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0rem;
    width: 100%;
  }

  .nav-buttons button {
    padding: 0.5rem 1rem;
    background-color: #164a41;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }
`;

function CurrentWeekCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' })));

  const startOfWeek = (date) => {
  const clone = new Date(date);
  const day = clone.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
  const diff = (day + 6) % 7; // Convert Sunday from 0 to 6, Monday = 0, etc.
  clone.setDate(clone.getDate() - diff);
  clone.setHours(0, 0, 0, 0); // Clear time portion
  return clone;
  };

  const endOfWeek = (start) => {
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return end;
  };

  const currentWeekStart = startOfWeek(new Date(selectedDate));
  const currentWeekEnd = endOfWeek(currentWeekStart);

  const nextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    setSelectedDate(next);
  };

  const prevWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    setSelectedDate(prev);
  };

  return (
    <CalendarWrapper>
      <div className="nav-buttons">
        <button onClick={prevWeek}>← Previous Week</button>
        <button onClick={nextWeek}>Next Week →</button>
      </div>
      <Calendar
        value={selectedDate}
        onClickDay={setSelectedDate}
        view="month"
        tileDisabled={() => true}
        tileClassName={({ date, view }) => {
          if (view === 'month') {
            if (date >= currentWeekStart && date <= currentWeekEnd) {
              return 'react-calendar__tile--week-visible';
            }
          }
          return null;
        }}
        formatShortWeekday={(locale, date) =>
          date.toLocaleDateString(locale, { weekday: 'short' })
        }
      />
    </CalendarWrapper>
  );
}

export default CurrentWeekCalendar;
