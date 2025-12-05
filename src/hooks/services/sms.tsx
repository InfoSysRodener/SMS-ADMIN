import { useMutation } from '@tanstack/react-query'
import { API_BASE_URL } from '@/config'

type SendSMSPayload = {
  to: string
  from: string
  message: string
}

type SendSMSResponse = {
  success: boolean
  message: string
}

export const useSendSMS = () => {
  return useMutation<SendSMSResponse, Error, SendSMSPayload>({
    mutationFn: async (payload: SendSMSPayload) => {
      const response = await fetch(`${API_BASE_URL}/send-sms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        throw new Error('Failed to send SMS')
      }
      return response.json()
    },
  })
}

type SendSMSBatchPayload = {
  file: File
}

type SendSMSBatchResponse = {
  status: string
  total_batches: number
  total_messages: number
}

export const useSendSMSBatch = () => {
  return useMutation<SendSMSBatchResponse, Error, SendSMSBatchPayload>({
    mutationFn: async (payload: SendSMSBatchPayload) => {
      const formData = new FormData()
      formData.append('file', payload.file)

      const response = await fetch(`${API_BASE_URL}/send-sms-batch`, {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) {
        throw new Error('Failed to send SMS batch')
      }
      return response.json()
    },
  })
}
