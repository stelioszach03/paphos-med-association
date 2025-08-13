import clsx from 'clsx'

export default function SectionHeader({
  eyebrow,
  title,
  description,
  className = '',
}: {
  eyebrow?: string
  title: string
  description?: string
  className?: string
}) {
  return (
    <div className={clsx('space-y-1 text-center', className)}>
      {eyebrow && <p className="text-xs font-medium text-primary uppercase tracking-wide">{eyebrow}</p>}
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      {description && <p className="text-sm text-muted-foreground max-w-2xl mx-auto">{description}</p>}
    </div>
  )
}
