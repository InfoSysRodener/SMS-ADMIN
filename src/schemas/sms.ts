import { z } from 'zod'

export const sendToOneSchema = z.object({
  from: z.string().min(1, 'Sender ID is required'),
  to: z.string().min(1, 'Recipient number is required'),
  text: z
    .string()
    .min(1, 'Message is required')
    .max(160, 'Message must be 160 characters or less'),
})

export const defaultSendToOneValues = {
  from: '',
  to: '',
  text: '',
}

export type SendToOneFormData = z.infer<typeof sendToOneSchema>
export type SendToOneFormDefaultValues = typeof defaultSendToOneValues

export const sendToManySchema = z
  .object({
    file: z.instanceof(File).nullable(),
  })
  .refine((data) => data.file !== null, {
    message: 'CSV file is required',
    path: ['file'],
  })
  .refine(
    (data) =>
      data.file === null ||
      data.file.type === 'text/csv' ||
      data.file.name.endsWith('.csv'),
    {
      message: 'File must be a CSV file',
      path: ['file'],
    },
  )

export const defaultSendToManyValues = {
  file: null as File | null,
}

export type SendToManyFormData = z.infer<typeof sendToManySchema>
export type SendToManyFormDefaultValues = typeof defaultSendToManyValues
