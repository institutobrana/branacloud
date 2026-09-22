import React from 'react';
import ReactDOM from 'react-dom/client';
const root = ReactDOM.createRoot(document.getElementById('root'));
Promise.all([
  import('./theme/branaTokens.css'),
  import('./styles/globals.css'),
  import('dayjs'),
  import('dayjs/plugin/weekday'),
]).then(async ([, , { default: dayjs }, { default: weekday }]) => {
  dayjs.extend(weekday);
  const { default: App } = await import('./app/App.jsx');
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
