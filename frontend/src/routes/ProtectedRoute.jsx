import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  // While Firebase resolves auth state, show a loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center animate-pulse">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm font-medium animate-pulse">Initializing ResearchForge...</p>
        </div>
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute
