import * as React from 'react'
import { cn } from '@/lib/utils'

// ─── Base field wrapper ──────────────────────────────────────────────────────

interface FieldWrapperProps {
  label?: string
  htmlFor?: string
  helper?: string
  error?: string
  required?: boolean
  className?: string
  children: React.ReactNode
}

export function FieldWrapper({
  label,
  htmlFor,
  helper,
  error,
  required,
  className,
  children,
}: FieldWrapperProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium text-brown"
        >
          {label}
          {required && <span className="text-primary ml-0.5" aria-hidden="true">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs text-red-600" role="alert" id={htmlFor ? `${htmlFor}-error` : undefined}>
          {error}
        </p>
      ) : helper ? (
        <p className="text-xs text-brown/50" id={htmlFor ? `${htmlFor}-helper` : undefined}>
          {helper}
        </p>
      ) : null}
    </div>
  )
}

// ─── Shared input styles ─────────────────────────────────────────────────────

const inputBase =
  'w-full rounded-lg border bg-white px-3 py-2 text-sm text-brown placeholder:text-brown/40 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed'

const inputError = 'border-red-400 focus:border-red-400 focus:ring-red-200'
const inputNormal = 'border-brown/15 hover:border-brown/30'

// ─── Input ───────────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helper?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  wrapperClassName?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helper,
      error,
      leftIcon,
      rightIcon,
      wrapperClassName,
      className,
      id,
      required,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
    const hasError = Boolean(error)

    const inputEl = (
      <div className="relative">
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-brown/40">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={hasError}
          aria-describedby={
            hasError
              ? `${inputId}-error`
              : helper
              ? `${inputId}-helper`
              : undefined
          }
          className={cn(
            inputBase,
            hasError ? inputError : inputNormal,
            leftIcon && 'pl-9',
            rightIcon && 'pr-9',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-brown/40">
            {rightIcon}
          </div>
        )}
      </div>
    )

    if (!label && !helper && !error) return inputEl

    return (
      <FieldWrapper
        label={label}
        htmlFor={inputId}
        helper={helper}
        error={error}
        required={required}
        className={wrapperClassName}
      >
        {inputEl}
      </FieldWrapper>
    )
  }
)

Input.displayName = 'Input'

// ─── Textarea ────────────────────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  helper?: string
  error?: string
  wrapperClassName?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { label, helper, error, wrapperClassName, className, id, required, ...props },
    ref
  ) => {
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
    const hasError = Boolean(error)

    const el = (
      <textarea
        ref={ref}
        id={inputId}
        required={required}
        aria-invalid={hasError}
        aria-describedby={
          hasError
            ? `${inputId}-error`
            : helper
            ? `${inputId}-helper`
            : undefined
        }
        className={cn(
          inputBase,
          'resize-y min-h-[80px]',
          hasError ? inputError : inputNormal,
          className
        )}
        {...props}
      />
    )

    if (!label && !helper && !error) return el

    return (
      <FieldWrapper
        label={label}
        htmlFor={inputId}
        helper={helper}
        error={error}
        required={required}
        className={wrapperClassName}
      >
        {el}
      </FieldWrapper>
    )
  }
)

Textarea.displayName = 'Textarea'

// ─── Select ──────────────────────────────────────────────────────────────────

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  helper?: string
  error?: string
  placeholder?: string
  options: { value: string; label: string }[]
  wrapperClassName?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helper,
      error,
      placeholder,
      options,
      wrapperClassName,
      className,
      id,
      required,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
    const hasError = Boolean(error)

    const el = (
      <div className="relative">
        <select
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={hasError}
          aria-describedby={
            hasError
              ? `${inputId}-error`
              : helper
              ? `${inputId}-helper`
              : undefined
          }
          className={cn(
            inputBase,
            'appearance-none cursor-pointer pr-8',
            hasError ? inputError : inputNormal,
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-brown/40">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    )

    if (!label && !helper && !error) return el

    return (
      <FieldWrapper
        label={label}
        htmlFor={inputId}
        helper={helper}
        error={error}
        required={required}
        className={wrapperClassName}
      >
        {el}
      </FieldWrapper>
    )
  }
)

Select.displayName = 'Select'

export default Input
