import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'kory'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonBaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  fullWidth?: boolean
  asChild?: boolean
  href?: string
}

type ButtonProps = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps>

type LinkButtonProps = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    href: string
  }

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-[#1A0E06] hover:bg-primary/90 focus-visible:ring-primary/50 shadow-sm',
  secondary:
    'bg-secondary text-white hover:bg-secondary/90 focus-visible:ring-secondary/50 shadow-sm',
  kory: 'bg-kory text-brown font-semibold hover:bg-kory/90 focus-visible:ring-kory/50 shadow-sm',
  outline:
    'border-2 border-primary text-primary bg-transparent hover:bg-primary/5 focus-visible:ring-primary/50',
  ghost:
    'bg-transparent text-brown hover:bg-brown/5 focus-visible:ring-brown/30',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm rounded-md gap-1.5',
  md: 'h-10 px-4 text-base rounded-lg gap-2',
  lg: 'h-12 px-6 text-lg rounded-xl gap-2.5',
}

const baseClasses =
  'inline-flex items-center justify-center font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none'

function Spinner({ size }: { size: ButtonSize }) {
  const dim = size === 'sm' ? 14 : size === 'lg' ? 20 : 16
  return (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin shrink-0"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  asChild = false,
  href,
  className,
  children,
  ...props
}: ButtonProps | LinkButtonProps) {
  const disabled = 'disabled' in props ? (props as ButtonProps).disabled : undefined
  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    className
  )

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {isLoading && <Spinner size={size} />}
        {children}
      </Link>
    )
  }

  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {isLoading && <Spinner size={size} />}
      {children}
    </button>
  )
}

export default Button
