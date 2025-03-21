import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/Auth/Signup';
import HomePage from './pages/HomePage';
import VerifyOtp from './pages/Auth/VerifyOtp';
import { useAuth } from './context/AuthContext';
import Login from './pages/Auth/Login';
import QuizPage from './pages/Quiz/QuizPage';
import Sidebar from './components/Sidebar';
import StudyPage from './pages/Study/StudyPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ForgotPasswordVerify from './pages/Auth/ForgotPasswordVerify';
import ForgotPasswordReset from './pages/Auth/ForgotPasswordReset';
import DashboardPage from './pages/Dashboard/DashboardPage';
const App = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Router>
      <div className="flex h-screen w-full">
        {/* Only show sidebar when authenticated */}
        {isAuthenticated && <Sidebar />}
        
        {/* Main content area - takes remaining space */}
        <div className="flex-1">
          <Routes>
            <Route path="/auth/signup" element={!isAuthenticated ? <Signup /> : <HomePage />} />
            <Route path="/auth/login" element={!isAuthenticated ? <Login /> : <HomePage />} />
            <Route path="/verify/:email" element={!isAuthenticated ? <VerifyOtp /> : <HomePage />} />
            <Route path="/home" element={!isAuthenticated ? <Signup /> : <HomePage />} />
            <Route path="/dashboard" element={!isAuthenticated ? <Signup /> : <DashboardPage />} />
            <Route path="/quizzes" element={!isAuthenticated ? <Signup /> : <QuizPage />} />
            <Route path="/auth/forgot-password" element={!isAuthenticated ? <ForgotPasswordPage/> : <HomePage/>} />
            <Route path="/auth/forgot-password-verify/:email" element={!isAuthenticated ? <ForgotPasswordVerify/> : <HomePage/>} />
            <Route path="/auth/forget-password-reset/:email" element={!isAuthenticated ? <ForgotPasswordReset/> : <HomePage/>} />
            <Route path="/study/chapter/:chapterNumber/verse/:verseNumber" element={!isAuthenticated ? <Signup/> : <StudyPage/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;