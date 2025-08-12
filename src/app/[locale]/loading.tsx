export default function Loading(){
  return (
    <div className="container py-10 grid md:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse h-32 bg-slate-100 rounded-xl" />
      ))}
    </div>
  )
}
