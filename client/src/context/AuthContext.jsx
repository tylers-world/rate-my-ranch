import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Set up axios interceptor to attach token
  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      const token = localStorage.getItem('rmr_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })
    return () => axios.interceptors.request.eject(interceptor)
  }, [])

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('rmr_token')
    if (token) {
      axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('rmr_token')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const signup = async (username, email, password) => {
    const res = await axios.post('/api/auth/signup', { username, email, password })
    localStorage.setItem('rmr_token', res.data.token)
    setUser(res.data.user)
    return res.data
  }

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password })
    localStorage.setItem('rmr_token', res.data.token)
    setUser(res.data.user)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('rmr_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
