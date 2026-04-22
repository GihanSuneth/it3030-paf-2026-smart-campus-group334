import { NavLink } from 'react-router-dom'
import { sidebarNavigation } from '../../constants/navigation'
import { ROLE_LABELS } from '../../constants/roles'
import { useAuth } from '../../hooks/useAuth'

export function Sidebar() {
  const { currentUser } = useAuth()
  const navigation = sidebarNavigation[currentUser.role] ?? []

  return (
    <aside className="sticky top-0 hidden h-dvh w-[18rem] flex-col overflow-y-auto border-r border-slate-200 bg-slate-50 px-6 py-8 lg:flex">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
          Signed In As
        </p>
        <p className="mt-2 text-xl font-bold text-slate-900">{ROLE_LABELS[currentUser.role]}</p>
        <p className="text-sm text-slate-500">{currentUser.name}</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1.5">
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            className={({ isActive }) =>
              `rounded-xl px-4 py-3 text-sm font-semibold transition duration-200 ${
                isActive
                  ? 'bg-[#1e3a5f] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
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
