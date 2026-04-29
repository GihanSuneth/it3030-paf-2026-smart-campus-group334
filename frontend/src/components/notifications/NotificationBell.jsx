import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNotifications } from '../../hooks/useNotifications'
import { NotificationList } from './NotificationList'

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const { recentNotifications, unreadCount, markAsRead } = useNotifications()

  return (
    <div className="relative">
      <button
        className="relative rounded-full border border-slate-200 bg-white p-3 text-slate-700 shadow-sm transition hover:border-[#b9cadc] hover:text-slate-950"
        type="button"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="sr-only">Open notifications</span>
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            d="M15 17h5l-1.4-1.4a2 2 0 0 1-.6-1.42V11a6 6 0 1 0-12 0v3.18a2 2 0 0 1-.6 1.42L4 17h5m6 0a3 3 0 1 1-6 0m6 0H9"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 inline-flex min-h-6 min-w-6 items-center justify-center rounded-full bg-[#f2e3cf] px-1 text-xs font-bold text-[#7f5530]">
            {unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-30 mt-3 w-[24rem] rounded-[24px] border border-slate-200 bg-white p-4 shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-950">Notifications</h3>
              <p className="text-sm text-slate-600">Recent activity across the system</p>
            </div>
            <Link className="text-sm font-semibold text-[#365f8b]" to="/notifications">
              View all
            </Link>
          </div>

          <NotificationList notifications={recentNotifications} onRead={markAsRead} compact />
        </div>
      ) : null}
    </div>
  )
}
