const statusClasses = {
  CREATED: 'status-amber',
  UNDER_REVIEW: 'status-blue',
  APPROVED: 'status-blue',
  TECHNICIAN_ASSIGNED: 'status-blue',
  RESOLVED: 'status-green',
  REJECTED: 'status-red',
  CLOSED: 'status-slate',
  OPEN: 'status-amber',
  IN_PROGRESS: 'status-blue',
}

export function TicketStatusBadge({ status }) {
  return <span className={`status-chip ${statusClasses[status]}`}>{status}</span>
}
