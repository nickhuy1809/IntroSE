import React from 'react';
import { NavLink } from 'react-router-dom';
import { ReactComponent as HomeIcon } from '../img/Home.svg';
import { ReactComponent as ScheduleIcon } from '../img/Schedule.svg';
import { ReactComponent as TaskIcon } from '../img/Task.svg';
import { ReactComponent as SectionIcon } from '../img/Section.svg';
import { ReactComponent as PomodoroIcon } from '../img/Pomodoro.svg';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className ="GroupItem">
      <NavLink
        to="/"
        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
      >
        <HomeIcon />
        <span>Home</span>
      </NavLink>
      <NavLink
        to="/schedule"
        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
      >
        <ScheduleIcon />
        <span>Schedule</span>
      </NavLink>
      <NavLink
        to="/task"
        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
      >
        
        <TaskIcon />
        <span>Task</span>
      </NavLink>
      <NavLink
        to="/grade"
        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
      >
        <SectionIcon />
        <span>Grade</span>
      </NavLink>
      <NavLink
        to="/pomodoro"
        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
      >
        <PomodoroIcon />
        <span>Pomodoro</span>
      </NavLink>
      </div>
    </div>
  );
}