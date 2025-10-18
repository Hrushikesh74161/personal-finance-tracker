import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Global CSS reset for layout
const globalStyles = `
  * {
    box-sizing: border-box;
  }
  
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
  }
  
  #root {
    height: 100%;
    margin: 0;
    padding: 0;
  }
`;

// Inject global styles
const styleSheet = document.createElement('style');
styleSheet.textContent = globalStyles;
document.head.appendChild(styleSheet);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
