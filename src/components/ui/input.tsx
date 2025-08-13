import { InputHTMLAttributes } from 'react'
import clsx from 'clsx'

export default function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        'flex h-10 w-full rounded-md border border-muted bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:pointer-events-none',
        className
      )}
      {...props}
    />
  )
}
