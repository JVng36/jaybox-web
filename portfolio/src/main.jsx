// This file(main.jsx) wires the plain browser page and the React app
import { StrictMode } from 'react' // Brings in React's development safety checker. It helps surface questionable code.
import { createRoot } from 'react-dom/client' // Imports the function that gives React a place to control the normal HTML page.
import './index.css' // Loads the global style sheet. Anything in index.css can affect the whole site.
import App from './App.jsx' // Imports main page component from App.jsx

// Finds the HTML element named root, turns it into a React-controlled area, and display the App component inside it
createRoot(document.getElementById('root')).render( // root lives in the root-level index.html as a div. index.html -> div root -> main.jsx (start React) -> app.jsx (supply the visible page)
  <StrictMode>
    <App />
  </StrictMode>,
)
