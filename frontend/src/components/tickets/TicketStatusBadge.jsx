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

// / A simple badge component that displays the ticket status with a color-coded background. The statusClasses object maps each possible status to a corresponding CSS class that defines the background color. This allows us to easily maintain a consistent visual representation of ticket statuses throughout the application by simply using this component wherever we need to display a ticket's status.
export function TicketStatusBadge({ status }) {
  return <span className={`status-chip ${statusClasses[status]}`}>{status}</span>
}
