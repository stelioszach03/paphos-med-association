import { TextareaHTMLAttributes } from 'react'
import clsx from 'clsx'

export default function Textarea({ className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={clsx(
        'flex w-full rounded-md border border-muted bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:pointer-events-none',
        className
      )}
      {...props}
    />
  )
}
