import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Layers, 
  PlusCircle, 
  Calendar, 
  AlertCircle, 
  Ticket, 
  Bell, 
  User, 
  ShieldCheck, 
  Settings, 
  Clock, 
  ClipboardList, 
  Wrench, 
  UserCheck, 
  Users, 
  Activity, 
  CheckSquare,
  LogOut
} from 'lucide-react'
import { sidebarNavigation } from '../../constants/navigation'
import { ROLE_LABELS } from '../../constants/roles'
import { useAuth } from '../../hooks/useAuth'

const iconMap = {
  'Dashboard': LayoutDashboard,
  'Resources': Layers,
  'New Booking': PlusCircle,
  'My Bookings': Calendar,
  'New Ticket': AlertCircle,
  'My Tickets': Ticket,
  'Notifications': Bell,
  'Profile': User,
  'Admin Dashboard': ShieldCheck,
  'Manage Resources': Settings,
  'Booking Handling': Calendar,
  'Ticket Handling': Ticket,
  'User Management': Users,
  'Profile': User,
}

export function Sidebar() {
  const { currentUser, logout } = useAuth()
  const navigation = sidebarNavigation[currentUser.role] ?? []

  return (
    <aside className="sticky top-0 hidden h-dvh w-[16rem] flex-col overflow-y-auto border-r border-slate-200/60 bg-white/50 backdrop-blur-xl px-4 py-6 lg:flex z-50">
      <div className="mb-8 px-2">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">Nexora</span>
        </div>
        
        <div className="rounded-xl bg-indigo-50/50 p-3 border border-indigo-100/50 text-center">
          <p className="text-[9px] font-bold uppercase tracking-widest text-indigo-400">
            {ROLE_LABELS[currentUser.role]}
          </p>
          <p className="mt-0.5 text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1.5">
        {navigation.map((item) => {
          const Icon = iconMap[item.label] || Layers
          return (
            <NavLink
              key={item.path}
              className="relative outline-none flex flex-col"
              to={item.path}
              end={item.path === '/admin' || item.path === '/dashboard' || item.path === '/technician'}
            >
              {({ isActive }) => (
                <div className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-300 z-10 ${
                  isActive 
                    ? 'text-white' 
                    : 'text-slate-500 hover:text-indigo-600'
                }`}>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200"
                      style={{ zIndex: -1 }}
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute -left-6 w-1 h-6 bg-indigo-600 rounded-r-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  
                  {/* Hover background for non-active states */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-white shadow-sm rounded-xl opacity-0 scale-95 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100" style={{ zIndex: -2 }} />
                  )}
                  
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.label}</span>
                </div>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-auto pt-6 px-2">
        <button 
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition-all hover:bg-rose-50 hover:text-rose-600"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
