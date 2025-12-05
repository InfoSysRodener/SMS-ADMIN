import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

import { FormWrapper } from '@/components/forms/form-wrapper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { authService, useLogin } from '@/hooks/services/auth'
import { defaultAuthValues, loginSchema } from '@/schemas/auth'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    // Only check authentication on client side (localStorage is only available in browser)
    // During SSR, window is undefined, so we skip the redirect
    if (typeof window !== 'undefined' && authService.isAuthenticated()) {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
  validateSearch: (search: Record<string, unknown>) => {
    return {
      redirect: (search.redirect as string) || undefined,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { mutateAsync: login } = useLogin()
  const { redirect: redirectTo } = Route.useSearch()

  const handleLogin = async (values: typeof defaultAuthValues) => {
    try {
      const response = await login(values)
      if (response.success) {
        const destination = redirectTo || '/dashboard'
        navigate({ to: destination })
      } else {
        toast.error(response.message || 'Login failed. Please try again.')
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'An error occurred. Please try again.',
      )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-tr from-background via-primary/20 to-primary-foreground/4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight">
              Admin
            </CardTitle>
            <CardDescription>Sign in to your admin account</CardDescription>
          </CardHeader>

          <CardContent>
            <FormWrapper
              schema={loginSchema}
              defaultValues={defaultAuthValues}
              onSubmit={handleLogin}
              className="space-y-4"
            >
              {(_form, Field, isSubmitting) => {
                return (
                  <>
                    <Field name="email" label="Email">
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        id="email"
                        disabled={isSubmitting}
                      />
                    </Field>
                    <Field name="password" label="Password">
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        id="password"
                        disabled={isSubmitting}
                      />
                    </Field>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Signing in...' : 'Sign in'}
                    </Button>
                  </>
                )
              }}
            </FormWrapper>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
