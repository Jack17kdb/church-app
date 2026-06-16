import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// Register PWA service worker with automatic updates (no reinstall needed)
if ('serviceWorker' in navigator) {
  import('virtual:pwa-register')
    .then(({ registerSW }) => {
      const updateSW = registerSW({
        immediate: true,
        onRegisteredSW(swUrl, registration) {
          // Periodically check for updates in the background
          if (registration) {
            setInterval(() => {
              registration.update();
            }, 60 * 60 * 1000); // every hour
          }
        },
        onNeedRefresh() {
          // A new version has been fetched and is ready.
          // Activate it and reload automatically so the user always
          // gets the latest version without manually reinstalling.
          updateSW(true);
        },
        onOfflineReady() {
          console.log('App ready for offline use');
        }
      });
    })
    .catch(() => {
      // PWA register not available in dev without vite-plugin-pwa build
    });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
