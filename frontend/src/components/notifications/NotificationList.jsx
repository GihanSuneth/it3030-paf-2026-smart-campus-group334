import { Link } from 'react-router-dom'
import { formatDateTime } from '../../utils/formatters'

export function NotificationList({ notifications, onRead, compact = false }) {
  return (
    <div className={compact ? 'space-y-2' : 'space-y-2.5'}>
      {notifications.map((notification) => {
        const content = (
          <>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-950">{notification.title}</h3>
              <p className="text-sm leading-6 text-slate-600">{notification.message}</p>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-slate-400">{formatDateTime(notification.createdAt)}</span>
              {onRead ? (
                <button
                  className="text-sm font-semibold text-blue-700"
                  type="button"
                  onClick={() => onRead(notification.id)}
                >
                  Mark read
                </button>
              ) : null}
            </div>
          </>
        )

        return notification.link ? (
          <Link
            key={notification.id}
            className="block rounded-[22px] border border-slate-200 bg-slate-50 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white"
            to={notification.link}
          >
            {content}
          </Link>
        ) : (
          <article
            key={notification.id}
            className="rounded-[22px] border border-slate-200 bg-slate-50 p-4"
          >
            {content}
          </article>
        )
      })}
    </div>
  )
}
