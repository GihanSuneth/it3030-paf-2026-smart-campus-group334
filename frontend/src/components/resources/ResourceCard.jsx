import { Link } from 'react-router-dom'

export function ResourceCard({ resource }) {
  return (
    <article className="panel flex h-full flex-col justify-between gap-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-950">{resource.name}</h3>
            <p className="text-sm text-slate-500">{resource.location}</p>
          </div>
          <span
            className={`status-chip ${
              resource.status === 'ACTIVE' ? 'status-green' : 'status-red'
            }`}
          >
            {resource.status}
          </span>
        </div>
        <p className="text-sm text-slate-600">{resource.description}</p>
        <div className="grid grid-cols-2 gap-3 text-sm text-slate-500">
          <span>Type: {resource.type}</span>
          <span>Capacity: {resource.capacity}</span>
          <span>Start: {resource.availabilityStart}</span>
          <span>End: {resource.availabilityEnd}</span>
        </div>
      </div>

      <Link className="btn-ghost w-full justify-center text-center" to={`/resources/${resource.id}`}>
        View Details
      </Link>
    </article>
  )
}
