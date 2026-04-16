import { Link } from 'react-router-dom'
import { formatDateTime } from '../../utils/formatters'

export function NotificationList({ notifications, onRead, compact = false }) {
  return (
    <div className={compact ? 'space-y-2' : 'space-y-3'}>
      {notifications.map((notification) => {
        const content = (
          <>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-950">{notification.title}</h3>
              <p className="text-base leading-7 text-slate-600">{notification.message}</p>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-slate-400">{formatDateTime(notification.createdAt)}</span>
              {onRead ? (
                <button
                  className="text-sm font-semibold text-[#775b35]"
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
            className="block rounded-3xl border border-[#e4ddcf] bg-[#fbf8f1] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[#d3c099] hover:bg-[#fffdf8]"
            to={notification.link}
          >
            {content}
          </Link>
        ) : (
          <article
            key={notification.id}
            className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
          >
            {content}
          </article>
        )
      })}
    </div>
  )
}
