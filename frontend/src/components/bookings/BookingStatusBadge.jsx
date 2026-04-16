const statusClasses = {
  PENDING: 'status-amber',
  APPROVED: 'status-green',
  REJECTED: 'status-red',
  CANCELLED: 'status-slate',
}

export function BookingStatusBadge({ status }) {
  return <span className={`status-chip ${statusClasses[status]}`}>{status}</span>
}
