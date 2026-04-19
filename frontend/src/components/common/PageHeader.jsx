export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 pb-3 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        {eyebrow ? (
          <span className="text-xs font-bold uppercase tracking-[0.26em] text-blue-700">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="font-serif-display text-[2.35rem] font-semibold tracking-tight text-slate-950 md:text-[2.55rem]">
          {title}
        </h1>
        {description ? <p className="max-w-2xl text-base leading-7 text-slate-600">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2.5 md:justify-end">{actions}</div> : null}
    </div>
  )
}
