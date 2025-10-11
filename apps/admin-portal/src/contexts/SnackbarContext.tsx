import React, { createContext, useContext, useState } from 'react'
import { Snackbar, Alert } from '@mui/material'

interface SnackbarContextType {
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showInfo: (message: string) => void
  showWarning: (message: string) => void
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined)

export const useSnackbar = () => {
  const context = useContext(SnackbarContext)
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider')
  }
  return context
}

interface SnackbarMessage {
  message: string
  severity: 'success' | 'error' | 'info' | 'warning'
}

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState<SnackbarMessage>({ message: '', severity: 'info' })

  const handleClose = () => {
    setOpen(false)
  }

  const showMessage = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbarMessage({ message, severity })
    setOpen(true)
  }

  const value = {
    showSuccess: (message: string) => showMessage(message, 'success'),
    showError: (message: string) => showMessage(message, 'error'),
    showInfo: (message: string) => showMessage(message, 'info'),
    showWarning: (message: string) => showMessage(message, 'warning')
  }

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={snackbarMessage.severity}>
          {snackbarMessage.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}