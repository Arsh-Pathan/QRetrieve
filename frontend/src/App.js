import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import FoundPage from './pages/FoundPage';
import NotificationPopup from './components/NotificationPopup';
import { NotificationProvider } from './hooks/useNotification';

function App() {
  return (
    <NotificationProvider>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/found/:itemId" element={<FoundPage />} />
          </Routes>
        </main>
        <NotificationPopup />
      </div>
    </NotificationProvider>
  );
}

export default App;
