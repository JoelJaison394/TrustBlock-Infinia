import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ContractsProvider } from './context/ContractsContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ContractsProvider><App /></ContractsProvider>

  </StrictMode>,
)
