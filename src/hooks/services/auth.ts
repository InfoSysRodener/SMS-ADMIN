import { useMutation } from '@tanstack/react-query'

type LoginCredentials = {
  email: string
  password: string
}

type LoginResponse = {
  success: boolean
  message: string
  user?: {
    email: string
    name: string
  }
}

// Auth storage keys
const AUTH_TOKEN_KEY = 'auth_token'
const AUTH_USER_KEY = 'auth_user'

/**
 * Authentication service to manage auth state
 */
export const authService = {
  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem(AUTH_TOKEN_KEY)
  },

  /**
   * Get the current user from storage
   */
  getUser(): { email: string; name: string } | null {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem(AUTH_USER_KEY)
    if (!userStr) return null
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  },

  /**
   * Set authentication token and user data
   */
  setAuth(token: string, user: { email: string; name: string }): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(AUTH_TOKEN_KEY, token)
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
  },

  /**
   * Clear authentication data (logout)
   */
  clearAuth(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
  },

  /**
   * Get the auth token
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(AUTH_TOKEN_KEY)
  },
}

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Login failed')
      }

      return response.json()
    },
    onSuccess: (data) => {
      // Store auth data on successful login
      if (data.success && data.user) {
        // Generate a simple token (in production, use a proper JWT from your backend)
        const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        authService.setAuth(token, data.user)
      }
    },
  })
}

/**
 * Hook to logout user
 */
export function useLogout() {
  return {
    logout: () => {
      authService.clearAuth()
      // Redirect will be handled by the router middleware
      window.location.href = '/'
    },
  }
}
