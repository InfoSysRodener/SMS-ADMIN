'use client'

import { useEffect, useRef, useState } from 'react'
import { FileCheck, Send, Upload } from 'lucide-react'
import { toast } from 'sonner'

import type React from 'react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { FormWrapper } from '@/components/forms/form-wrapper'
import { defaultSendToManyValues, sendToManySchema } from '@/schemas/sms'
import { useSendSMSBatch } from '@/hooks/services/sms'

export function SendToManyForm() {
  const { mutateAsync: sendSMSBatch } = useSendSMSBatch()
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<{ reset: () => void } | null>(null)
  const shouldResetRef = useRef(false)

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    form: any,
  ) => {
    const selectedFile = e.target.files?.[0]

    if (selectedFile) {
      if (
        selectedFile.type === 'text/csv' ||
        selectedFile.name.endsWith('.csv')
      ) {
        form.setFieldValue('file', selectedFile)
        setFileName(selectedFile.name)
      } else {
        toast.error('Please select a CSV file')
        form.setFieldValue('file', null)
        setFileName(null)
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add('bg-primary/10', 'dark:bg-slate-700')
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-primary/10', 'dark:bg-slate-700')
  }

  const handleDrop = (e: React.DragEvent, form: any) => {
    e.preventDefault()
    e.currentTarget.classList.remove('bg-primary/10', 'dark:bg-slate-700')

    if (e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]

      if (
        droppedFile.type === 'text/csv' ||
        droppedFile.name.endsWith('.csv')
      ) {
        form.setFieldValue('file', droppedFile)
        setFileName(droppedFile.name)
      } else {
        toast.error('Please drop a CSV file')
      }
    }
  }

  return (
    <FormWrapper
      schema={sendToManySchema}
      defaultValues={defaultSendToManyValues}
      onSubmit={async (values) => {
        try {
          if (!values.file) {
            toast.error('Please select a CSV file')
            return
          }

          const response = await sendSMSBatch({ file: values.file })

          toast.success(
            `SMS campaign started! Total batches: ${response.total_batches}, Total messages: ${response.total_messages}`,
          )

          // Reset form
          shouldResetRef.current = true
          setFileName(null)
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : 'An error occurred. Please try again.',
          )
        }
      }}
      className="space-y-8"
    >
      {(form, _Field, isSubmitting) => {
        const fileValue = form.state.values.file

        // Store form reference for reset
        formRef.current = form

        // Reset form after successful submission
        useEffect(() => {
          if (shouldResetRef.current && !isSubmitting) {
            form.reset()
            shouldResetRef.current = false
          }
        }, [form, isSubmitting])

        // Sync fileName with form state
        if (fileValue && !fileName) {
          setFileName(fileValue.name)
        } else if (!fileValue && fileName) {
          setFileName(null)
        }

        return (
          <>
            {/* Instructions */}
            <div className="bg-primary/10 dark:bg-slate-800 border border-primary/20 dark:border-slate-700 rounded-lg p-4">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                <span className="font-semibold">CSV Format Required:</span> Your
                file should contain columns for phone numbers, recipient names,
                and any personalization fields.
              </p>
            </div>

            {/* File Upload Area */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Upload CSV File
              </Label>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, form)}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center transition-colors cursor-pointer hover:border-primary dark:hover:border-primary"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileChange(e, form)}
                  className="hidden"
                />

                {fileName ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileCheck className="w-10 h-10 text-green-600 dark:text-green-500" />

                    <p className="font-medium text-slate-900 dark:text-white">
                      {fileName}
                    </p>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Ready to upload
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-10 h-10 text-primary dark:text-primary" />

                    <p className="font-medium text-slate-900 dark:text-white">
                      Drag & Drop your CSV here
                    </p>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      or
                    </p>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-primary dark:text-primary font-medium hover:underline"
                    >
                      Browse Files
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* CSV Template Info */}
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                CSV Template Example:
              </p>

              <div className="bg-white dark:bg-slate-900 rounded p-3 font-mono text-xs overflow-x-auto">
                <div className="text-slate-700 dark:text-slate-300">
                  phone,name,message
                </div>

                <div className="text-slate-500 dark:text-slate-400">
                  +1234567890,John,Hello John!
                </div>

                <div className="text-slate-500 dark:text-slate-400">
                  +1234567891,Jane,Hello Jane!
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !fileValue}
              className="w-full bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 text-white font-medium py-2 h-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 mr-2" />

              {isSubmitting ? 'Processing...' : 'Send SMS Campaign'}
            </Button>
          </>
        )
      }}
    </FormWrapper>
  )
}
