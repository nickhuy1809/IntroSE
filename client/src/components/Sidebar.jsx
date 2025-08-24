import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ReactComponent as HomeIcon } from "../img/Home.svg";
import { ReactComponent as ScheduleIcon } from "../img/Schedule.svg";
import { ReactComponent as TaskIcon } from "../img/Task.svg";
import { ReactComponent as SectionIcon } from "../img/Section.svg";
import { ReactComponent as PomodoroIcon } from "../img/Pomodoro.svg";

export default function Sidebar() {
  const sidebarRef = useRef(null);

  // actual mouse position
  const [target, setTarget] = useState({ x: 0, y: 0 });
  // smooth spotlight position
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0 });

  // generate random blinking particles
  const [particles] = useState(() =>
  Array.from({ length: 6 }).map(() => ({
    radius: 80 + Math.random() * 160,        // distance from spotlight
    angle: Math.random() * Math.PI * 2,      // start angle
    driftSpeed: 0.05 + Math.random() * 0.1,  // radians per second
    size: 40 + Math.random() * 40,
    phase: Math.random() * Math.PI * 2,
    blinkSpeed: 0.5 + Math.random() * 0.8,
  }))
);

  const handleMouseMove = (e) => {
    const rect = sidebarRef.current.getBoundingClientRect();
    setTarget({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Smooth follow effect
  useEffect(() => {
    let animationFrame;
    const animate = () => {
      setSpotlight((prev) => {
        const lerp = 0.05;
        return {
          x: prev.x + (target.x - prev.x) * lerp,
          y: prev.y + (target.y - prev.y) * lerp,
        };
      });
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target]);

  // compute blinking lights
  const time = Date.now() / 1000;
  const particleGradients = particles.map((p) => {
  // drifting position (orbit around spotlight)
  const dx = Math.cos(p.angle + time * p.driftSpeed) * p.radius;
  const dy = Math.sin(p.angle + time * p.driftSpeed) * p.radius;

  // blinking opacity
  const opacity = 0.1 + 0.1 * Math.sin(time * p.blinkSpeed + p.phase);

  return `radial-gradient(circle ${p.size}px at ${spotlight.x + dx}px ${
    spotlight.y + dy
  }px, rgba(255,255,200,${opacity}) 0%, rgba(255,255,255,0) 80%)`;
  });

  return (
    <div
      className="sidebar"
      ref={sidebarRef}
      onMouseMove={handleMouseMove}
    >
      {/* Spotlight Layer */}
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          background: `
            radial-gradient(circle 350px at ${spotlight.x}px ${spotlight.y}px,
              rgba(100,200,255,0.25) 0%, rgba(255,255,255,0) 80%),
            ${particleGradients.join(",")}
          `,
          mixBlendMode: "screen",
          transition: "background 0.1s linear",
        }}
      />

      {/* Navigation Items */}
      <div className="GroupItem">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <HomeIcon />
          <span>Home</span>
        </NavLink>
        <NavLink to="/schedule" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <ScheduleIcon />
          <span>Schedule</span>
        </NavLink>
        <NavLink to="/task" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <TaskIcon />
          <span>Task</span>
        </NavLink>
        <NavLink to="/grade" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <SectionIcon />
          <span>Grade</span>
        </NavLink>
        <NavLink to="/pomodoro" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <PomodoroIcon />
          <span>Pomodoro</span>
        </NavLink>
      </div>
    </div>
  );
}
