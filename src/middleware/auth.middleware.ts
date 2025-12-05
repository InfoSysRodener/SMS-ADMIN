import { redirect } from '@tanstack/react-router'
import { authService } from '@/hooks/services/auth'

export interface AuthContext {
  auth: {
    isAuthenticated: boolean
    user: { email: string; name: string } | null
  }
}

/**
 * Authentication middleware for route protection
 * Handles redirects and provides auth context to routes
 */
export function authMiddleware({
  location,
}: {
  location: { pathname: string; href: string }
}): AuthContext {
  // Check if we're on the client side (localStorage is only available in browser)
  const isClient = typeof window !== 'undefined'

  // Check authentication status
  const isAuthenticated = authService.isAuthenticated()
  const user = authService.getUser()

  // Only perform redirects on the client side
  // During SSR, window is undefined, so we skip redirects and let client handle it
  if (isClient) {
    // If user is authenticated and on root (login page), redirect to dashboard
    if (isAuthenticated && location.pathname === '/') {
      throw redirect({
        to: '/dashboard',
      })
    }

    // If user is not authenticated and trying to access a protected route
    if (!isAuthenticated && location.pathname !== '/') {
      // Redirect to login (root page)
      throw redirect({
        to: '/',
        search: {
          redirect: location.href, // Save the intended destination
        },
      })
    }
  }

  // Return auth context for child routes
  // During SSR, this will return default values (isAuthenticated: false, user: null)
  // On client, it will return the actual values from localStorage
  return {
    auth: {
      isAuthenticated,
      user,
    },
  }
}
