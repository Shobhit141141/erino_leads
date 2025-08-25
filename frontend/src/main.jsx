import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'

import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css';
import { QueryClientProvider } from './config/reactQuery';
import { queryClient } from './config/reactQuery';
import { AuthProvider } from './context/AuthContext.jsx';
import { HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <MantineProvider defaultColorScheme='dark' >
              <ToastContainer position='top-center' />
              <App />
            </MantineProvider>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>,
)
