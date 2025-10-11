export interface ApiError {
  message: string
  statusCode?: number
  code?: string
}

export const handleApiError = (error: ApiError, showError: (message: string) => void) => {
  console.error('API Error:', error)
  
  if (error.message) {
    showError(error.message)
  } else {
    showError('An unexpected error occurred. Please try again.')
  }
}