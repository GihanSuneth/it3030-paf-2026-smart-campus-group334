import { formatDateTime, formatRole } from '../../utils/formatters'

export function TicketCommentList({ comments }) {
  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <article key={comment.id} className="interactive-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">{comment.authorName}</h4>
              <p className="text-xs text-slate-500">{formatRole(comment.authorRole)}</p>
            </div>
            <p className="text-xs text-slate-500">{formatDateTime(comment.createdAt)}</p>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">{comment.message}</p>
        </article>
      ))}
    </div>
  )
}
