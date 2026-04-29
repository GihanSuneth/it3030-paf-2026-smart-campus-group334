export function StatCard({ label, value, hint }) {
  return (
    <article className="glass-card flex flex-col justify-between hover-lift min-h-[10rem]">
      <div className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-500">{label}</p>
        <h3 className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums">{value}</h3>
      </div>
      {hint && (
        <div className="pt-4 mt-auto border-t border-slate-100">
          <p className="text-xs font-medium text-slate-500">{hint}</p>
        </div>
      )}
    </article>
  )
}
