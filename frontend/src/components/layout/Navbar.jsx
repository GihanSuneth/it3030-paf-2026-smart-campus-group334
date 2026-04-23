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
    <header className="sticky top-0 z-20 mb-5 flex flex-col gap-4 border-b border-slate-200 bg-white/95 pb-4 pt-4 backdrop-blur md:flex-row md:items-center md:justify-between px-2">
      <div>
        <div className="flex items-center gap-3">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1e3a5f]">
            NEXORA
          </p>
          <span className="hidden h-px w-8 bg-slate-200 md:block" />
          <p className="hidden text-xs font-bold uppercase tracking-[0.1em] text-slate-400 md:block">
            University Management Suite
          </p>
        </div>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          {resolvePageTitle(location.pathname)}
        </h2>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <NotificationBell />
        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm whitespace-nowrap">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e3a5f] text-sm font-bold text-white">
            {getInitials(currentUser.name)}
          </span>
          <div className="min-w-0 pr-2">
            <p className="truncate text-sm font-bold text-slate-900">{currentUser.name}</p>
            <p className="truncate text-xs text-slate-500">{currentUser.email}</p>
          </div>
        </div>
        <button className="rounded-xl bg-[#1e3a5f] hover:bg-[#152845] transition text-white px-5 py-2 text-sm font-bold shadow-sm whitespace-nowrap" type="button" onClick={logout}>
          Sign Out
        </button>
      </div>
    </header>
  )
}
