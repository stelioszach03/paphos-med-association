import type { ReactNode } from 'react'

export default function Field({ label, hint, error, children, className = '' }: { label: string; hint?: string; error?: string; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label className="block text-sm text-slate-600 mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  )
}
