import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider>
      <ToastContainer />
      <App />
    </MantineProvider>
  </StrictMode>,
)
