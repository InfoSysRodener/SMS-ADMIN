'use client'

import React, { cloneElement, isValidElement } from 'react'
import { Field as TFField } from '@tanstack/react-form'
import type { AnyFormApi } from '@tanstack/react-form'
import {
  FieldDescription,
  FieldError,
  FieldLabel,
  Field as UIField,
} from '@/components/ui/field'
import { cn } from '@/lib/utils'

type FieldHelpers = {
  state: any
  handleBlur: () => void
  handleChange: (value: any) => void
  inputProps: React.InputHTMLAttributes<HTMLInputElement>
}

type Props = {
  name: string
  label?: React.ReactNode
  description?: string
  className?: string
  form: AnyFormApi
  children: React.ReactNode | ((field: FieldHelpers) => React.ReactNode)
}

export function FormFieldWrapper({
  name,
  label,
  description,
  children,
  className,
  form,
}: Props) {
  return (
    <TFField
      form={form}
      name={name}
      children={(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid

        const baseInputProps = {
          name,
          value: field.state.value ?? '',
          onBlur: field.handleBlur,
          onChange: (e: any) => field.handleChange(e?.target?.value ?? e),
          'aria-invalid': isInvalid,
          id: name,
        }

        const fieldHelpers = {
          state: field.state,
          handleBlur: field.handleBlur,
          handleChange: field.handleChange,
          inputProps: baseInputProps,
        }

        const child =
          typeof children === 'function'
            ? children(fieldHelpers)
            : isValidElement(children)
              ? cloneElement(children as any, {
                  // Merge user props first (for className, placeholder, type, id, etc.)
                  ...(children as any).props,
                  // Then apply form props (controlled props take precedence)
                  ...baseInputProps,
                  // User can override id if needed, otherwise use name
                  id: (children as any).props?.id || name,
                })
              : children

        return (
          <UIField className={className}>
            {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}

            {child}

            {description && <FieldDescription>{description}</FieldDescription>}

            {isInvalid && <FieldError errors={field.state.meta.errors} />}
          </UIField>
        )
      }}
    />
  )
}
