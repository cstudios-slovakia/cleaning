import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import './index.css'

function App() {
  const [user, setUser] = useState(null)
  
  // Basic session check
  useEffect(() => {
    const savedUser = localStorage.getItem('emerald_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        localStorage.removeItem('emerald_user')
      }
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('emerald_user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('emerald_user')
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen font-sans antialiased text-gray-900 dark:text-gray-100 flex flex-col">
        {!navigator.onLine && (
          <div className="bg-red-500 text-white text-center py-1 text-sm font-semibold sticky top-0 z-50">
            Offline Mode - Syncing when connected
          </div>
        )}
        
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/*" 
            element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
