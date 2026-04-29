export function LoadingState({ label = 'Loading content...' }) {
  return (
    <div className="section-panel flex min-h-36 items-center justify-center">
      <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
        <span className="h-3.5 w-3.5 animate-pulse rounded-full bg-slate-900" />
        {label}
      </div>
    </div>
  )
}
