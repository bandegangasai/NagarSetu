import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { ComplaintProvider } from './contexts/ComplaintContext';
import { NotificationProvider } from './contexts/NotificationContext';
import './i18n';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ComplaintProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </ComplaintProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
