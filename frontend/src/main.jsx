import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
// import { AuthProvider } from './context/AuthContext.jsx';
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppProvider from './context/AppProvider.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
          <GoogleOAuthProvider clientId="">
    <AppProvider>
      <App />
      </AppProvider>
      </GoogleOAuthProvider>
  </StrictMode>
);
