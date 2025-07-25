import React from 'react';
import ScheduleCalendar from '../components/ScheduleCalendar';
import '../components/css/Schedule.css';

export default function Schedule() {
  return (
    <div className="schedule-page">
      <div className="schedule-header">
        <h1>Schedule</h1>
        <p>Manage your calendar</p>
      </div>
      <ScheduleCalendar defaultView="week" availableViews={['week', 'month']} />
    </div>
  );
}