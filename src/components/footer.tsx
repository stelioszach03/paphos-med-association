export default function Footer({ t, locale }: { t:any; locale:string }){
  return (
    <footer className="border-t border-slate-200 mt-10">
      <div className="container py-8 text-sm text-slate-600 flex items-center justify-between">
        <span>© {new Date().getFullYear()} {t.site.title}</span>
        <span className="text-slate-400">Paphos Medical Association</span>
      </div>
    </footer>
  )
}
