import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { UIProvider } from './context/UIContext';
import './index.css';
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <UIProvider>
        <BookingProvider>
          <App />
          <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'Sora, sans-serif', fontSize: '14px' } }} />
        </BookingProvider>
      </UIProvider>
    </AuthProvider>
  </BrowserRouter>
);
