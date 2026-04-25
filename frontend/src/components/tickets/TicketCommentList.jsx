import { formatDateTime, formatRole } from '../../utils/formatters'

// Component to display a list of comments for a ticket
export function TicketCommentList({ comments }) {
  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <article key={`${comment.userId}-${comment.timestamp}`} className="interactive-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">{comment.userName}</h4>
              <p className="text-xs text-slate-500">{formatRole(comment.authorRole || 'USER')}</p>
            </div>
            <p className="text-xs text-slate-500">{formatDateTime(comment.timestamp)}</p>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">{comment.message}</p>
        </article>
      ))}
    </div>
  )
}
