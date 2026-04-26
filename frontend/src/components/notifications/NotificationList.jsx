import { Link } from 'react-router-dom'
import { formatDateTime } from '../../utils/formatters'

export function NotificationList({ notifications, onRead, compact = false }) {
  return (
    <div className={compact ? 'space-y-2' : 'space-y-3'}>
      {notifications.map((notification) => {
        const content = (
          <>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">{notification.title}</h3>
              <p className="text-sm leading-6 text-slate-500">{notification.message}</p>
            </div>
            <div className="flex items-center justify-between gap-3 pt-2">
              <span className="text-xs text-slate-400">{formatDateTime(notification.createdAt)}</span>
              {onRead ? (
                <button
                  className="text-xs font-bold text-slate-600 hover:text-slate-900"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onRead(notification.id);
                  }}
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
            className="block rounded-xl bg-slate-50 p-4 transition duration-200 hover:bg-slate-100"
            to={notification.link}
          >
            {content}
          </Link>
        ) : (
          <article
            key={notification.id}
            className="rounded-xl bg-slate-50 p-4"
          >
            {content}
          </article>
        )
      })}
    </div>
  )
}
