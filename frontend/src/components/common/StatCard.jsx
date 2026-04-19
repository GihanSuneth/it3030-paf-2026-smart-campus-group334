export function StatCard({ label, value, hint }) {
  return (
    <article className="metric-card-lux micro-lift space-y-1.5">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <h3 className="text-[2rem] font-semibold tracking-tight text-slate-950">{value}</h3>
      {hint ? <p className="text-sm leading-6 text-slate-600">{hint}</p> : null}
    </article>
  )
}
