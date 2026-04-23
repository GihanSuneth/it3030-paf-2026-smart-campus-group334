import { Link } from 'react-router-dom'
import { formatDateTime } from '../../utils/formatters'

export function NotificationList({ notifications, onRead, compact = false }) {
  return (
    <div className={compact ? 'space-y-3' : 'space-y-4'}>
      {notifications.map((notification) => {
        const content = (
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4 mb-1">
              <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">{notification.title}</h3>
              {onRead && (
                <button
                  className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 px-2 py-1 rounded-md hover:bg-indigo-50 transition-all"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onRead(notification.id);
                  }}
                >
                  Clear Alert
                </button>
              )}
            </div>
            <p className="text-sm leading-relaxed text-slate-500 font-medium">{notification.message}</p>
            <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-slate-300">
              Synced: {formatDateTime(notification.createdAt)}
            </p>
          </div>
        )

        const styles = "block rounded-2xl bg-white border border-slate-100 p-5 transition-all shadow-sm hover:shadow-md hover:border-indigo-100 group cursor-pointer"
        
        return notification.link ? (
          <Link key={notification.id} className={styles} to={notification.link}>
            {content}
          </Link>
        ) : (
          <article key={notification.id} className={styles}>
            {content}
          </article>
        )
      })}
    </div>
  )
}
