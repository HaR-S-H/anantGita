import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import "./document.css"
// import { AuthProvider } from './context/AuthContext.jsx';
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppProvider from './context/AppProvider.jsx';
createRoot(document.getElementById('root')).render(
      <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
    <AppProvider>
      <App />
      </AppProvider>
      </GoogleOAuthProvider>
);
