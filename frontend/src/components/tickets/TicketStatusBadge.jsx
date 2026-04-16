const statusClasses = {
  OPEN: 'status-amber',
  IN_PROGRESS: 'status-blue',
  RESOLVED: 'status-green',
  CLOSED: 'status-slate',
  REJECTED: 'status-red',
}

export function TicketStatusBadge({ status }) {
  return <span className={`status-chip ${statusClasses[status]}`}>{status}</span>
}
