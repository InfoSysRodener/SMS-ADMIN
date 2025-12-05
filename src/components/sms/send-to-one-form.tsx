import { useStore } from '@tanstack/react-form'
import { Send } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { FormWrapper } from '@/components/forms/form-wrapper'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { defaultSendToOneValues, sendToOneSchema } from '@/schemas/sms'
import { useSendSMS } from '@/hooks/services/sms'

export function SendToOneForm() {
  const { mutateAsync: sendSMS } = useSendSMS()
  const formRef = useRef<{ reset: () => void } | null>(null)
  const shouldResetRef = useRef(false)

  return (
    <FormWrapper
      schema={sendToOneSchema}
      defaultValues={defaultSendToOneValues}
      onSubmit={async (values) => {
        try {
          const response = await sendSMS({
            to: values.to,
            from: values.from,
            message: values.text,
          })

          if (response.success) {
            toast.success(`SMS sent successfully to ${values.to}`)
            shouldResetRef.current = true
          } else {
            toast.error(response.message || 'Failed to send SMS')
          }
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : 'An error occurred. Please try again.',
          )
        }
      }}
      className="space-y-6"
    >
      {(form, Field, isSubmitting) => {
        const textValue = useStore(
          form.store,
          (state) => state.values.text || '',
        )

        // Store form reference for reset
        formRef.current = form

        // Reset form after successful submission
        useEffect(() => {
          if (shouldResetRef.current && !isSubmitting) {
            form.reset()
            shouldResetRef.current = false
          }
        }, [form, isSubmitting])

        return (
          <>
            {/* From Field */}
            <Field
              name="from"
              label="From (Sender ID)"
              description="Your sender name or number"
            >
              <Input
                placeholder="e.g., MyBusiness"
                className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                disabled={isSubmitting}
              />
            </Field>

            {/* To Field */}
            <Field
              name="to"
              label="To (Recipient Number)"
              description="Include country code"
            >
              <Input
                placeholder="e.g., +1234567890"
                className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                disabled={isSubmitting}
              />
            </Field>

            {/* Message Text */}
            <div className="space-y-2">
              <Field name="text" label="Message">
                <Textarea
                  placeholder="Type your SMS message here..."
                  rows={5}
                  className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 resize-none"
                  disabled={isSubmitting}
                />
              </Field>

              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Max 160 characters</span>
                <span>{textValue.length}/160</span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 text-white font-medium py-2 h-auto"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Sending...' : 'Send SMS'}
            </Button>
          </>
        )
      }}
    </FormWrapper>
  )
}
