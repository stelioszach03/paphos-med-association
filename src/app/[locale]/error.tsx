'use client'
import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])
  return (
    <div className="container py-10 text-center">
      <h1 className="text-2xl font-bold mb-4">Κάτι πήγε στραβά</h1>
      <button onClick={() => reset()} className="btn-outline">Δοκίμασε ξανά</button>
    </div>
  )
}
