import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

export const Route = createFileRoute('/api/auth')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          const { email, password } = body

          // Validate credentials
          if (email === 'admin@gmail.com' && password === '12345') {
            return json(
              {
                success: true,
                message: 'Login successful',
                user: {
                  email: 'admin@gmail.com',
                  name: 'Admin User',
                },
              },
              { status: 200 },
            )
          } else {
            return json(
              {
                success: false,
                message: 'Invalid email or password',
              },
              { status: 401 },
            )
          }
        } catch (error) {
          return json(
            {
              success: false,
              message: 'Invalid request format',
            },
            { status: 400 },
          )
        }
      },
    },
  },
})
