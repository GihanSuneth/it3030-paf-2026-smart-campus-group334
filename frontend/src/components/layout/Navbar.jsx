import { useLocation } from 'react-router-dom'
import { pageTitles } from '../../constants/navigation'
import { useAuth } from '../../hooks/useAuth'
import { getInitials } from '../../utils/formatters'
import { NotificationBell } from '../notifications/NotificationBell'

function resolvePageTitle(pathname) {
  return pageTitles.find((item) => pathname.startsWith(item.match))?.title ?? 'Workspace'
}

export function Navbar() {
  const location = useLocation()
  const { currentUser, logout } = useAuth()

  return (
    <header className="sticky top-0 z-20 mb-4 flex flex-col gap-3 border-b border-slate-200/90 bg-slate-100/90 pb-3 backdrop-blur md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <p className="text-[1.45rem] font-bold uppercase tracking-[0.28em] text-slate-900">
            NEXORA
          </p>
          <span className="hidden h-px w-10 bg-[#c8d6e5] md:block" />
          <p className="hidden text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 md:block">
            University Management Suite
          </p>
        </div>
        <h2 className="mt-1.5 text-[2.05rem] font-semibold tracking-tight text-slate-950 md:text-[2.25rem]">
          {resolvePageTitle(location.pathname)}
        </h2>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <NotificationBell />
        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3.5 py-2 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
            {getInitials(currentUser.name)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{currentUser.name}</p>
            <p className="truncate text-xs text-slate-500">{currentUser.email}</p>
          </div>
        </div>
        <button className="btn-primary" type="button" onClick={logout}>
          Sign Out
        </button>
      </div>
    </header>
  )
}
