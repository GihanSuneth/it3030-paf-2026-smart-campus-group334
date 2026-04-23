export function StatCard({ label, value, hint }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm min-h-[9rem] flex flex-col justify-between">
      <div>
        <p className="text-sm font-bold text-slate-900">{label}</p>
        <h3 className="mt-2 text-3xl font-bold text-slate-900">{value}</h3>
      </div>
      {hint ? <p className="mt-4 text-sm leading-6 text-slate-500">{hint}</p> : null}
    </article>
  )
}
