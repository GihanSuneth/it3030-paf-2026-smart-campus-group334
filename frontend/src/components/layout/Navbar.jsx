import { useLocation } from 'react-router-dom'
import { pageTitles } from '../../constants/navigation'
import { useAuth } from '../../hooks/useAuth'
import { getInitials } from '../../utils/formatters'
import { NotificationBell } from '../notifications/NotificationBell'
import { Search, User } from 'lucide-react'

function resolvePageTitle(pathname) {
  return pageTitles.find((item) => pathname.startsWith(item.match))?.title ?? 'Workspace'
}

export function Navbar() {
  const location = useLocation()
  const { currentUser } = useAuth()

  return (
    <header className="sticky top-0 z-40 mb-6 flex flex-col gap-4 bg-transparent pb-3 pt-5 backdrop-blur-[2px] md:flex-row md:items-center md:justify-between px-2">
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-500 bg-indigo-50/80 px-2 py-0.5 rounded-full">
            Nexora
          </span>
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
            System
          </span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {resolvePageTitle(location.pathname)}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4">
          <NotificationBell />
          
          <div className="group relative flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white shadow-sm px-3 py-1.5 hover:shadow-md transition-all cursor-pointer">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 text-sm font-bold text-white shadow-inner">
              {getInitials(currentUser.name)}
            </div>
            <div className="hidden sm:block min-w-0 pr-2">
              <p className="truncate text-xs font-bold text-slate-900">{currentUser.name}</p>
              <p className="truncate text-[10px] text-slate-400 font-medium">{currentUser.email}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
