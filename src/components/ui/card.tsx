import clsx from 'clsx'
import { HTMLAttributes } from 'react'

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('rounded-lg border border-muted bg-background text-foreground shadow-sm', className)} {...props} />
}

export function CardHeader({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('border-b border-muted p-4', className)} {...props} />
}

export function CardContent({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('p-4', className)} {...props} />
}

export function CardFooter({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('border-t border-muted p-4', className)} {...props} />
}

export default Card
