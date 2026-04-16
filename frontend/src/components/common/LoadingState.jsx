export function LoadingState({ label = 'Loading content...' }) {
  return (
    <div className="section-panel flex min-h-40 items-center justify-center">
      <div className="flex items-center gap-3 text-base font-medium text-slate-600">
        <span className="h-3.5 w-3.5 animate-pulse rounded-full bg-[#22375d]" />
        {label}
      </div>
    </div>
  )
}
