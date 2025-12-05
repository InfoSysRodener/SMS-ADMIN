import * as React from 'react'
import { useForm, useStore } from '@tanstack/react-form'
import { FormFieldWrapper } from './form-field-wrapper'
import type { AnyFormApi, StandardSchemaV1 } from '@tanstack/react-form'
import { cn } from '@/lib/utils'

type FieldComponent = React.ComponentType<
  Omit<React.ComponentProps<typeof FormFieldWrapper>, 'form'>
>

type FormWrapperProps<T> = {
  schema: StandardSchemaV1<T>
  defaultValues: T
  onSubmit: (values: T) => void | Promise<void>
  children: (
    form: AnyFormApi,
    Field: FieldComponent,
    isSubmitting: boolean,
  ) => React.ReactNode
  className?: string
  actions?: React.ReactNode
}

export function FormWrapper<T>({
  schema,
  defaultValues,
  onSubmit,
  children,
  className,
  actions,
}: FormWrapperProps<T>) {
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: schema,
    },
    onSubmit: ({ value }) => {
      onSubmit(value)
    },
  })

  const isSubmitting = useStore(form.store, (state) => state.isSubmitting)

  const FieldWithForm = React.useCallback<FieldComponent>(
    (props) => <FormFieldWrapper {...props} form={form} />,
    [form],
  )

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className={cn('space-y-2', className)}
    >
      {children(form, FieldWithForm, isSubmitting)}
      {actions}
    </form>
  )
}
