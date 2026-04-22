/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => authApi.getCurrentUser())
  const [authLoading, setAuthLoading] = useState(false)

  useEffect(() => {
    setCurrentUser(authApi.getCurrentUser())
  }, [])

  async function login(credentials) {
    setAuthLoading(true)

    try {
      const user = await authApi.login(credentials)
      setCurrentUser(user)
      return user
    } finally {
      setAuthLoading(false)
    }
  }

  async function oauthLogin(provider, role) {
    setAuthLoading(true)
    
    try {
      const user = await authApi.oauthLogin(provider, role)
      setCurrentUser(user)
      return user
    } finally {
      setAuthLoading(false)
    }
  }

  async function logout() {
    setAuthLoading(true)

    try {
      await authApi.logout()
      setCurrentUser(null)
    } finally {
      setAuthLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        authLoading,
        isAuthenticated: Boolean(currentUser),
        login,
        oauthLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.')
  }

  return context
}
