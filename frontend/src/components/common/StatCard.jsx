export function StatCard({ label, value, hint }) {
  return (
    <article className="metric-card-lux micro-lift space-y-2">
      <p className="text-base font-semibold text-slate-600">{label}</p>
      <h3 className="text-[2.2rem] font-semibold tracking-tight text-slate-950">{value}</h3>
      {hint ? <p className="text-base leading-7 text-slate-600">{hint}</p> : null}
    </article>
  )
}
