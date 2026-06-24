import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1f2e',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
