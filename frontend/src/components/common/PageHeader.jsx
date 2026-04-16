export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="flex flex-col gap-4 border-b border-[#e2dccd] pb-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2.5">
        {eyebrow ? (
          <span className="text-sm font-bold uppercase tracking-[0.24em] text-[#775b35]">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="font-serif-display text-4xl font-semibold tracking-tight text-slate-950 md:text-[2.7rem]">
          {title}
        </h1>
        {description ? <p className="max-w-3xl text-lg leading-8 text-slate-600">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3 md:justify-end">{actions}</div> : null}
    </div>
  )
}
