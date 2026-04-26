const defaultOptions = [{ label: 'All', value: 'ALL' }]

export function ResourceFilterBar({
  filters,
  onChange,
  locations = [],
  types = [],
  statuses = [],
}) {
  return (
    <div className="panel grid gap-3 xl:grid-cols-4">
      <label className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Search</span>
        <input
          className="input"
          placeholder="Search by resource or location"
          value={filters.query}
          onChange={(event) => onChange('query', event.target.value)}
        />
      </label>
      <label className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Type</span>
        <select
          className="input"
          value={filters.type}
          onChange={(event) => onChange('type', event.target.value)}
        >
          {defaultOptions.concat(types.map((type) => ({ label: type, value: type }))).map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </label>
      <label className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Location</span>
        <select
          className="input"
          value={filters.location}
          onChange={(event) => onChange('location', event.target.value)}
        >
          {defaultOptions
            .concat(locations.map((location) => ({ label: location, value: location })))
            .map((location) => (
              <option key={location.value} value={location.value}>
                {location.label}
              </option>
            ))}
        </select>
      </label>
      <label className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Status</span>
        <select
          className="input"
          value={filters.status}
          onChange={(event) => onChange('status', event.target.value)}
        >
          {defaultOptions
            .concat(statuses.map((status) => ({ label: status, value: status })))
            .map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
        </select>
      </label>
    </div>
  )
}
