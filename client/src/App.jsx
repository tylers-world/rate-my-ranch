import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import RestaurantPage from './pages/RestaurantPage'
import LeaderboardPage from './pages/LeaderboardPage'
import AddRestaurantPage from './pages/AddRestaurantPage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/restaurant/:id" element={<RestaurantPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/add" element={<AddRestaurantPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
        <footer className="bg-gray-bg border-t border-gray-border py-8 text-center mt-16">
          <p className="font-display font-bold text-dark text-lg">Rate My Ranch</p>
          <p className="text-gray-text text-sm mt-1">Because life's too short for bad ranch.</p>
          <p className="text-gray-text/50 text-xs mt-3">&copy; {new Date().getFullYear()} Rate My Ranch</p>
        </footer>
      </div>
    </AuthProvider>
  )
}

export default App
