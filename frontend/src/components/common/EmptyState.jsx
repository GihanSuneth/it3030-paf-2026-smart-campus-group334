export function EmptyState({ title, message, action }) {
  return (
    <div className="section-panel flex min-h-36 flex-col items-center justify-center gap-2.5 text-center">
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <p className="max-w-md text-sm leading-6 text-slate-600">{message}</p>
      {action}
    </div>
  )
}
