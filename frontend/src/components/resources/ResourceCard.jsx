import { Link } from 'react-router-dom'

export function ResourceCard({ resource }) {
  return (
    <article className="glass-card hover:border-indigo-400/30 flex flex-col md:flex-row items-center gap-6 p-6 cursor-pointer group/card transition-all">
      <div className="h-20 w-20 flex-shrink-0 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center group-hover/card:scale-105 group-hover/card:bg-white transition-all duration-300">
        <span className="text-2xl">
          {resource.type.includes('Lab') ? '💻' : 
           resource.type.includes('Hall') || resource.type.includes('Auditorium') ? '🏢' : 
           resource.type.includes('Projector') ? '📹' : '🛠️'}
        </span>
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-slate-950 truncate">{resource.name}</h3>
          <span className={`status-chip ${resource.status === 'ACTIVE' ? 'status-green' : 'status-red'}`}>
            {resource.status}
          </span>
        </div>
        
        <div className="flex flex-col gap-1">
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider">{resource.type}</p>
          <p className="text-sm font-medium text-slate-500">{resource.location} • Capacity: {resource.capacity}</p>
        </div>

        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
          <p className="text-sm text-slate-600 leading-relaxed italic">
            "{resource.description || 'No description provided for this resource.'}"
          </p>
        </div>
        
        <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span className="flex items-center gap-1.5">Code: <span className="text-slate-600">{resource.code}</span></span>
          {resource.assetId ? (
            <span className="flex items-center gap-1.5">Asset ID: <span className="text-slate-600">{resource.assetId}</span></span>
          ) : null}
          {resource.stockType ? (
            <span className="flex items-center gap-1.5">Stock: <span className="text-slate-600">{resource.stockType}</span></span>
          ) : null}
          {typeof resource.available === 'boolean' ? (
            <span className="flex items-center gap-1.5">Available: <span className="text-slate-600">{resource.available ? 'Yes' : 'No'}</span></span>
          ) : null}
          {resource.assignedTo ? (
            <span className="flex items-center gap-1.5">Assigned To: <span className="text-slate-600">{resource.assignedTo}</span></span>
          ) : null}
          {resource.serviceOrder ? (
            <span className="flex items-center gap-1.5">Service Order: <span className="text-slate-600">{resource.serviceOrder}</span></span>
          ) : null}
        </div>
      </div>

      <div className="flex-shrink-0 w-full md:w-auto">
        <Link 
          className="btn-primary w-full md:w-auto justify-center whitespace-nowrap" 
          to={`/resources/${resource.id}`}
        >
          View Details
        </Link>
      </div>
    </article>
  )
}
