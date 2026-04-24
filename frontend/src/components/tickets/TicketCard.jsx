import { Link } from 'react-router-dom'
import { TicketStatusBadge } from './TicketStatusBadge'

export function TicketCard({ ticket, href = `/tickets/${ticket.id}` }) {
  return (
    <article className="glass-card flex flex-col md:flex-row items-center gap-6 p-5 cursor-pointer group hover-lift">
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <TicketStatusBadge status={ticket.status} />
          <h3 className="text-lg font-bold text-slate-950 truncate">{ticket.title}</h3>
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-black text-white tracking-widest">
            {ticket.ticketCode || ticket.id}
          </span>
        </div>
        
        <p className="text-sm font-medium text-slate-500">
          {ticket.location}
        </p>

        <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span>Priority: <span className={ticket.priority === 'HIGH' ? 'text-rose-500' : 'text-slate-600'}>{ticket.priority}</span></span>
          <span>Category: <span className="text-slate-600">{ticket.category}</span></span>
          {ticket.technicianName && (
             <span className="text-indigo-400">Assigned: <span className="text-indigo-600">{ticket.technicianName}</span></span>
          )}
        </div>
      </div>

      <div className="flex-shrink-0 w-full md:w-auto">
        <Link className="btn-primary w-full md:w-auto justify-center whitespace-nowrap !py-2 !px-5 shadow-sm" to={href}>
          Track Issue
        </Link>
      </div>
    </article>
  )
}
