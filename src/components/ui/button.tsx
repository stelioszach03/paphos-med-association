import { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

const variants = {
  default: 'bg-primary text-foreground hover:bg-primary/90',
  secondary: 'bg-muted text-foreground hover:bg-muted/80',
  outline: 'border border-muted bg-transparent hover:bg-muted',
  destructive: 'bg-destructive text-foreground hover:bg-destructive/90',
}

const sizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-9 px-4 text-sm',
  lg: 'h-10 px-6 text-base',
}

export default function Button({
  className = '',
  variant = 'default',
  size = 'md',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
}) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-md font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:pointer-events-none transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
}
