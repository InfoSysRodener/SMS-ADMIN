import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const defaultAuthValues = {
  email: '',
  password: '',
}

export type LoginFormData = z.infer<typeof loginSchema>

export type LoginFormDefaultValues = typeof defaultAuthValues
