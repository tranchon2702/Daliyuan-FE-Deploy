import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n'; // Import i18n configuration
import React from 'react'; // Added missing import for React

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
