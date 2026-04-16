import { Link } from 'react-router-dom'
import { TicketStatusBadge } from './TicketStatusBadge'

export function TicketCard({ ticket, href = `/tickets/${ticket.id}` }) {
  return (
    <article className="panel flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-lg font-semibold text-slate-950">{ticket.title}</h3>
          <TicketStatusBadge status={ticket.status} />
        </div>
        <p className="text-sm text-slate-500">
          {ticket.resourceName} · {ticket.location}
        </p>
        <p className="text-sm text-slate-600">{ticket.description}</p>
        <div className="flex flex-wrap gap-3 text-sm text-slate-500">
          <span>Priority: {ticket.priority}</span>
          <span>Category: {ticket.category}</span>
          {ticket.assignedTechnicianName ? (
            <span>Technician: {ticket.assignedTechnicianName}</span>
          ) : null}
        </div>
      </div>

      <Link className="btn-ghost text-center" to={href}>
        View Ticket
      </Link>
    </article>
  )
}
