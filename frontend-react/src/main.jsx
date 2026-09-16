import React from 'react';
import ReactDOM from 'react-dom/client';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import App from './app/App.jsx';
import './theme/branaTokens.css';
import './styles/globals.css';

dayjs.extend(weekday);
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
