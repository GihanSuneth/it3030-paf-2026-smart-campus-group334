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
    <header className="sticky top-0 z-20 mb-5 flex flex-col gap-4 border-b border-[#e0dbcf] bg-[#f8f6f0]/95 pb-4 backdrop-blur md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <p className="text-[1.65rem] font-bold uppercase tracking-[0.3em] text-[#22375d]">
            NEXORA
          </p>
          <span className="hidden h-px w-10 bg-[#c2ad86] md:block" />
          <p className="hidden text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 md:block">
            University Management Suite
          </p>
        </div>
        <h2 className="mt-2 text-[2.4rem] font-semibold tracking-tight text-slate-950">
          {resolvePageTitle(location.pathname)}
        </h2>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <NotificationBell />
        <div className="flex items-center gap-3 rounded-full border border-stone-200 bg-[#fffdf8] px-4 py-2.5 shadow-sm">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1f2d45] text-base font-bold text-white">
            {getInitials(currentUser.name)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-slate-900">{currentUser.name}</p>
            <p className="truncate text-sm text-slate-500">{currentUser.email}</p>
          </div>
        </div>
        <button className="btn-primary" type="button" onClick={logout}>
          Sign Out
        </button>
      </div>
    </header>
  )
}
