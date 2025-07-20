import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Mainpage from './components/Mainpage';
import Schedule from './components/Schedule';
import CornerShapes from './components/CornerShapes';
import './App.css';
import './components/Layout.css';

function App() {
  return (
    <Router>
      <div className="dashboard">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Mainpage />} />
            <Route path="/schedule" element={<Schedule />} />
          </Routes>
        </div>
        <CornerShapes />
      </div>
    </Router>
  );
}

export default App;