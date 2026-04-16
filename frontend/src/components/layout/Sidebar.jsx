import { NavLink } from 'react-router-dom'
import { sidebarNavigation } from '../../constants/navigation'
import { ROLE_LABELS } from '../../constants/roles'
import { useAuth } from '../../hooks/useAuth'

export function Sidebar() {
  const { currentUser } = useAuth()
  const navigation = sidebarNavigation[currentUser.role] ?? []

  return (
    <aside className="sticky top-0 hidden h-dvh w-[24rem] flex-col overflow-y-auto border-r border-[#d8d8dc] bg-[#1f2d45] px-7 py-8 text-white lg:flex">
      <div className="rounded-3xl border border-white/12 bg-white/8 p-6 shadow-[0_18px_36px_rgba(18,28,47,0.28)]">
        <p className="text-[2.15rem] font-bold uppercase tracking-[0.34em] text-[#d4bc8d]">
          NEXORA
        </p>
        <h1 className="mt-2 font-serif-display text-[1.85rem] font-semibold leading-tight text-white">
          University Management Suite
        </h1>
        <p className="mt-4 text-base leading-7 text-[#eef3ed]">
          Smart campus operations for resources, bookings, tickets, and alerts.
        </p>
      </div>

      <div className="mt-6 rounded-3xl border border-white/12 bg-white/8 p-5 shadow-[0_12px_28px_rgba(19,42,37,0.12)]">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d7e2dc]">
          Signed In As
        </p>
        <p className="mt-3 text-xl font-semibold text-white">{ROLE_LABELS[currentUser.role]}</p>
        <p className="text-base text-[#eef3ed]">{currentUser.name}</p>
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-2">
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            className={({ isActive }) =>
              `rounded-2xl px-5 py-4 text-base font-semibold transition duration-300 ${
                isActive
                  ? 'bg-[#c8b08a] text-[#1f2d45] shadow-lg shadow-[#162033]/30'
                  : 'text-[#eef3ed] hover:bg-white/10 hover:text-white'
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
