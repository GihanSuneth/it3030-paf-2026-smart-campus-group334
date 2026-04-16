export function ErrorState({ title = 'Unable to load data', message, action }) {
  return (
    <div className="section-panel flex min-h-40 flex-col items-center justify-center gap-3 text-center">
      <h3 className="text-2xl font-semibold text-slate-900">{title}</h3>
      <p className="max-w-md text-base leading-7 text-rose-700">{message}</p>
      {action}
    </div>
  )
}
