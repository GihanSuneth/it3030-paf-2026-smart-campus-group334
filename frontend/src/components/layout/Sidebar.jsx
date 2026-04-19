import { NavLink } from 'react-router-dom'
import { sidebarNavigation } from '../../constants/navigation'
import { ROLE_LABELS } from '../../constants/roles'
import { useAuth } from '../../hooks/useAuth'

export function Sidebar() {
  const { currentUser } = useAuth()
  const navigation = sidebarNavigation[currentUser.role] ?? []

  return (
    <aside className="sticky top-0 hidden h-dvh w-[22rem] flex-col overflow-y-auto border-r border-slate-800/40 bg-[#16324f] px-6 py-6 text-slate-100 lg:flex">
      <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 shadow-[0_18px_36px_rgba(2,6,23,0.34)]">
        <p className="text-[1.95rem] font-bold uppercase tracking-[0.32em] text-[#dbe7f3]">
          NEXORA
        </p>
        <h1 className="mt-2 font-serif-display text-[1.7rem] font-semibold leading-tight text-white">
          University Management Suite
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Smart campus operations for resources, bookings, tickets, and alerts.
        </p>
      </div>

      <div className="mt-5 rounded-[28px] border border-white/10 bg-white/6 p-4 shadow-[0_12px_28px_rgba(2,6,23,0.22)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          Signed In As
        </p>
        <p className="mt-2 text-lg font-semibold text-white">{ROLE_LABELS[currentUser.role]}</p>
        <p className="text-sm text-slate-300">{currentUser.name}</p>
      </div>

      <nav className="mt-5 flex flex-1 flex-col gap-2">
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            className={({ isActive }) =>
              `rounded-2xl px-4 py-3.5 text-sm font-semibold transition duration-300 ${
                isActive
                  ? 'bg-[#e7eef6] text-[#16324f] shadow-lg shadow-slate-950/20'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`
            }
            to={item.path}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
