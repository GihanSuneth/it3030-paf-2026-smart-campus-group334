export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="flex flex-col gap-4 pb-4 md:flex-row md:items-start md:justify-between">
      <div className="space-y-4 max-w-xl">
        <div className="space-y-1">
          {eyebrow ? (
            <span className="text-xs font-bold uppercase tracking-widest text-[#1e3a5f]">
              {eyebrow}
            </span>
          ) : null}
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>
        </div>
        {description ? <p className="text-sm leading-6 text-slate-500">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-col gap-2 md:items-end min-w-[12rem]">{actions}</div> : null}
    </div>
  )
}
