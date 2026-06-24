import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from './ProtectedRoute'

import LandingPage from '../pages/Landing/LandingPage'
import Login from '../pages/Auth/Login'
import Signup from '../pages/Auth/Signup'
import ForgotPassword from '../pages/Auth/ForgotPassword'
import DashboardPage from '../pages/Dashboard/DashboardPage'
import NewResearch from '../pages/Research/NewResearch'
import ResearchDetails from '../pages/Research/ResearchDetails'
import ResearchHistory from '../pages/Research/ResearchHistory'
import ReportsPage from '../pages/Reports/ReportsPage'
import ReportViewer from '../pages/Reports/ReportViewer'
import SettingsPage from '../pages/Settings/SettingsPage'
import ProfilePage from '../pages/Profile/ProfilePage'
import NotFound from '../pages/NotFound/NotFound'

import ErrorBoundary from '../components/ui/ErrorBoundary'

// Redirect already-authenticated users away from auth pages
function AuthRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children
}

function AppRoutes() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/signup" element={<AuthRoute><Signup /></AuthRoute>} />
        <Route path="/forgot-password" element={<AuthRoute><ForgotPassword /></AuthRoute>} />

        {/* Protected */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/research/new" element={<ProtectedRoute><NewResearch /></ProtectedRoute>} />
        <Route path="/research/history" element={<ProtectedRoute><ResearchHistory /></ProtectedRoute>} />
        <Route path="/research/:id" element={<ProtectedRoute><ResearchDetails /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
        <Route path="/reports/:id" element={<ProtectedRoute><ReportViewer /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default AppRoutes
