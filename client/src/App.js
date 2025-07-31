import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Mainpage from './pages/Mainpage';
import Schedule from './pages/Schedule';
import Pomodoro from './pages/Pomodoro';
import Grade from './pages/Grade';
import CornerShapes from './components/CornerShapes';
import './components/css/Layout.css';
import {v4 as uuidv4} from 'uuid';

function App() {
//   const [loading, setLoading] = useState(true); // để chờ xử lý account

//   useEffect(() => {
//     const setupAccount = async () => {
//       let accountId = localStorage.getItem('accountId');
//       if (!accountId) {
//         accountId = uuidv4();
//         localStorage.setItem('accountId', accountId);
//       }

//       try {
//         const response = await fetch('http://localhost:5000/accounts', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ id: accountId }),
//         });

//         if (!response.ok) throw new Error('Failed to create or get account');

//         const data = await response.json();
//         console.log('Account loaded/created:', data);
//         setLoading(false); // Đã xong, cho phép render app
//       } catch (error) {
//         console.error('Error initializing account:', error);
//       }
//     };

//     setupAccount();
//   }, []);

//   if (loading) return <div>Loading account...</div>; // hoặc spinner, hoặc splash

  return (
    <Router>
      <div className="dashboard">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Mainpage />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/grade" element={<Grade />} />
            <Route path="/pomodoro" element={<Pomodoro />} /> {/* Add this route */}
          </Routes>
        </div>
        <CornerShapes />
      </div>
    </Router>
  );
}

export default App;