import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from '../pages/Auth/Login';
import Signup from '../pages/Auth/Signup';
import VerifyOtp from '../pages/Auth/VerifyOtp';


const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useSelector(state => state.auth);
    
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" />;
    }
    
    return children;
  };
  
  const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useSelector(state => state.auth);
    
    if (isAuthenticated) {
    //   return <Navigate to="/" />;
    }
    
    return children;
  };
  
  const AppRouter = () => {
    return (
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/auth/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/auth/signup" 
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } 
          />
          <Route 
            path="/auth/verify" 
            element={<VerifyOtp />} 
          />
  
          {/* Private Routes */}
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                {/* <Home /> */}
              </PrivateRoute>
            } 
          />
          
          {/* 404 Page */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Router>
    );
  };
  
  export default AppRouter;