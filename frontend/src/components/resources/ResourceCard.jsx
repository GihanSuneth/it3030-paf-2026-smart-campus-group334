import { Link } from 'react-router-dom'
import { getResourceCategory, RESOURCE_CATEGORIES } from '../../constants/resources'

function getStatusClass(status) {
  if (status === 'AVAILABLE' || status === 'WORKING') return 'status-green'
  return 'status-red'
}

function getResourceIcon(type) {
  if (type.includes('Lab')) return '💻'
  if (type.includes('Hall') || type.includes('Auditorium')) return '🏢'
  if (type.includes('Projector')) return '📹'
  if (type.includes('Smart Board')) return '🧠'
  if (type.includes('Audio')) return '🔊'
  return '🛠️'
}

function buildSummary(resource) {// The buildSummary function generates a summary of key attributes for a given resource based on its type and category. It checks the resource's category to determine if it is equipment and constructs a summary array with relevant details such as stock type, location, and service order for equipment resources. For other types of resources, it builds a summary that includes capacity, the number of working projectors, smart boards, sound systems, and other amenities based on the specific type of resource (e.g., PC Lab or Lecture Hall). This function helps create a concise overview of the resource's features for display in the ResourceCard component.
  if (getResourceCategory(resource.type, resource.category) === RESOURCE_CATEGORIES.EQUIPMENT) {
    return [
      resource.stockType ? `Stock: ${resource.stockType}` : null,
      resource.location,
      resource.serviceOrder ? `Service order ${resource.serviceOrder}` : null,
    ].filter(Boolean)
  }

  if (resource.type === 'PC Lab') {
    return [
      `Capacity ${resource.capacity ?? 0}`,
      `PCs ${resource.workingPcs ?? 0}/${resource.totalPcs ?? 0} working`,
      `Smart Boards ${resource.workingSmartBoards ?? 0}/${resource.smartBoardCount ?? 0}`,
      `Projectors ${resource.workingProjectors ?? 0}/${resource.projectorCount ?? 0}`,
      `Sound Systems ${resource.workingSoundSystems ?? 0}/${resource.soundSystemCount ?? 0}`,
    ]
  }

  if (resource.type === 'Lecture Hall') {
    return [
      `Seats ${resource.capacity ?? 0}`,
      `Projectors ${resource.workingProjectors ?? 0}/${resource.projectorCount ?? 0}`,
      `Screens ${resource.workingScreens ?? 0}/${resource.screenCount ?? 0}`,
      `Sound Systems ${resource.workingSoundSystems ?? 0}/${resource.soundSystemCount ?? 0}`,
    ]
  }

  return [
    `Capacity ${resource.capacity ?? 0}`,
    `Projectors ${resource.workingProjectors ?? 0}/${resource.projectorCount ?? 0}`,
    `Sound Systems ${resource.workingSoundSystems ?? 0}/${resource.soundSystemCount ?? 0}`,
  ]
}

export function ResourceCard({ resource }) {
  const isEquipment = getResourceCategory(resource.type, resource.category) === RESOURCE_CATEGORIES.EQUIPMENT
  const summary = buildSummary(resource)

  return (
    <article className="glass-card hover:border-indigo-400/30 flex flex-col md:flex-row items-center gap-6 p-6 cursor-pointer group/card transition-all">
      <div className="h-20 w-20 flex-shrink-0 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center group-hover/card:scale-105 group-hover/card:bg-white transition-all duration-300">
        <span className="text-2xl">{getResourceIcon(resource.type)}</span>
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-slate-950 truncate">{resource.name}</h3>
          <span className={`status-chip ${getStatusClass(resource.status)}`}>
            {resource.status}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider">{resource.type}</p>
          <p className="text-sm font-medium text-slate-500">{resource.location}</p>
        </div>

        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
          <p className="text-sm text-slate-600 leading-relaxed italic">
            "{resource.description || 'No description provided for this resource.'}"
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {summary.map((item) => (
            <span
              key={item}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span className="flex items-center gap-1.5">Code: <span className="text-slate-600">{resource.code}</span></span>
          {resource.assetId ? (
            <span className="flex items-center gap-1.5">Asset ID: <span className="text-slate-600">{resource.assetId}</span></span>
          ) : null}
          {typeof resource.available === 'boolean' ? (
            <span className="flex items-center gap-1.5">Available: <span className="text-slate-600">{resource.available ? 'Yes' : 'No'}</span></span>
          ) : null}
          {isEquipment && resource.assignedTo ? (
            <span className="flex items-center gap-1.5">Assigned To: <span className="text-slate-600">{resource.assignedTo}</span></span>
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
