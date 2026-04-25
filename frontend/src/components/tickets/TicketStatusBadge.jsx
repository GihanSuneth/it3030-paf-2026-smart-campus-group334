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

/// A badge component that displays the status of a ticket with appropriate styling. The status is passed as a prop, and we use a mapping to determine the CSS class to apply based on the status value. This allows us to easily maintain consistent styling for different ticket statuses across the application.
export function TicketStatusBadge({ status }) {
  return <span className={`status-chip ${statusClasses[status]}`}>{status}</span>
}
