import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AlertProvider } from './contexts/AlertContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AlertProvider>
      <App />
    </AlertProvider>
  </React.StrictMode>,
);
