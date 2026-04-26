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
      </label>// The ResourceFilterBar component provides a user interface for filtering resources based on various criteria such as type, location, and status. It includes a search input for querying resources by name or location, as well as dropdown select inputs for filtering by resource type, location, and status. The component uses the defaultOptions array to include an "All" option in each dropdown, allowing users to reset the filter to show all resources. The onChange function is called whenever a filter value changes, allowing the parent component to update the displayed resources accordingly based on the selected filters.
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
            </option>// The dropdown for resource type is populated by concatenating the default "All" option with the list of types passed as props. Each type is mapped to an option element, allowing users to filter resources based on their type. When a user selects a type from the dropdown, the onChange function is called with the updated filter value, enabling the parent component to adjust the displayed resources accordingly.
          ))}
        </select>
      </label>
      <label className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Location</span>
        <select
          className="input"
          value={filters.location}
          onChange={(event) => onChange('location', event.target.value)}
        >//The dropdown for location is similarly constructed by combining the default "All" option with the list of locations provided as props. This allows users to filter resources based on their physical location within the campus. When a location is selected, the onChange function updates the filters, enabling the parent component to display only resources that match the selected location criteria.
          {defaultOptions
            .concat(locations.map((location) => ({ label: location, value: location })))
            .map((location) => (
              <option key={location.value} value={location.value}>
                {location.label}
              </option>
            ))}
        </select>// The dropdown for status is constructed in the same way as the type and location dropdowns, allowing users to filter resources based on their current status (e.g., Available, Under Maintenance, etc.). By selecting a status from the dropdown, users can narrow down the displayed resources to those that match the chosen status, and the onChange function will update the filters accordingly to reflect this selection in the parent component's resource display logic.
      </label>
      <label className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Status</span>
        <select
          className="input"
          value={filters.status}
          onChange={(event) => onChange('status', event.target.value)}
        >//The status dropdown is populated by concatenating the default "All" option with the list of statuses provided as props. This allows users to filter resources based on their current status, such as "Available", "Under Maintenance", or "Out of Service". When a user selects a status from the dropdown, the onChange function is triggered with the updated filter value, enabling the parent component to adjust the displayed resources to match the selected status criteria.
          {defaultOptions
            .concat(statuses.map((status) => ({ label: status, value: status })))
            .map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
        </select>//
      </label>
    </div>
  )
}
