import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowUpRight, 
  Layers, 
  Calendar, 
  Ticket, 
  Zap, 
  TrendingUp, 
  Users,
  Bell,
  Plus,
  Clock,
  CheckSquare
} from 'lucide-react'
import { bookingApi } from '../../api/bookingApi'
import { resourceApi } from '../../api/resourceApi'
import { ticketApi } from '../../api/ticketApi'
import { EmptyState } from '../../components/common/EmptyState'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { PageHeader } from '../../components/common/PageHeader'
import { StatCard } from '../../components/common/StatCard'
import { PageContainer } from '../../components/layout/PageContainer'
import { NotificationList } from '../../components/notifications/NotificationList'
import { AnimatedGrid } from '../../components/common/AnimatedGrid'
import { GlassCard } from '../../components/common/GlassCard'
import { ROLE_HOME_PATHS, ROLES, ROLE_LABELS } from '../../constants/roles'
import { useAuth } from '../../hooks/useAuth'
import { useMockQuery } from '../../hooks/useMockQuery'
import { useNotifications } from '../../hooks/useNotifications'

export function DashboardPage() {
  const { currentUser } = useAuth()
  const { recentNotifications, markAsRead } = useNotifications()
  const resourceQuery = useMockQuery(() => resourceApi.getResources(), [])
  const bookingsQuery = useMockQuery(
    () =>
      currentUser.role === ROLES.USER
        ? bookingApi.getMyBookings(currentUser.id)
        : bookingApi.getAllBookings(),
    [currentUser.id, currentUser.role],
  )
  const ticketsQuery = useMockQuery(
    () =>
      currentUser.role === ROLES.TECHNICIAN
        ? ticketApi.getAssignedTickets(currentUser.id)
        : currentUser.role === ROLES.USER
          ? ticketApi.getMyTickets(currentUser.id)
          : ticketApi.getAllTickets(),
    [currentUser.id, currentUser.role],
  )

  if (resourceQuery.loading || bookingsQuery.loading || ticketsQuery.loading) {
    return <LoadingState label="Orchestrating workspace..." />
  }

  if (resourceQuery.error || bookingsQuery.error || ticketsQuery.error) {
    return (
      <ErrorState 
        title="Orchestration Interrupted"
        message={resourceQuery.error || bookingsQuery.error || ticketsQuery.error}
        action={<button onClick={() => window.location.reload()} className="btn-primary">Retry Terminal</button>}
      />
    )
  }

  const quickActions =
    currentUser.role === ROLES.USER
      ? [
          { label: 'Browse Resources', path: '/resources', icon: Layers, color: 'indigo' },
          { label: 'Create Booking', path: '/bookings/new', icon: Calendar, color: 'violet' },
          { label: 'Raise Ticket', path: '/tickets/new', icon: Ticket, color: 'rose' },
        ]
      : currentUser.role === ROLES.ADMIN
        ? [
            { label: 'Admin Terminal', path: '/admin', icon: Zap, color: 'emerald' },
            { label: 'Pending Queue', path: '/admin/bookings/pending', icon: Clock, color: 'amber' },
            { label: 'Operations', path: '/admin/tickets', icon: Users, color: 'blue' },
          ]
        : [
            { label: 'Tech Terminal', path: '/technician', icon: Zap, color: 'indigo' },
            { label: 'Task Queue', path: '/technician/tickets', icon: CheckSquare, color: 'emerald' },
            { label: 'Updates', path: '/notifications', icon: Bell, color: 'rose' },
          ]

  const stats = [
    {
      label: 'Campus Resources',
      value: resourceQuery.data?.length || 0,
      hint: 'Managed facilities',
      icon: Layers,
      trend: '+2 this week'
    },
    {
      label: 'Active Bookings',
      value: bookingsQuery.data?.length || 0,
      hint: 'Reserved slots',
      icon: Calendar,
      trend: '3 pending'
    },
    {
      label: 'Incident Tickets',
      value: ticketsQuery.data?.length || 0,
      hint: 'Support cases',
      icon: Ticket,
      trend: 'Mostly resolved'
    },
    {
      label: 'System Status',
      value: 'Optimal',
      hint: '99.9% Uptime',
      icon: TrendingUp,
      trend: 'No outages'
    },
  ]

  return (
    <PageContainer>
      <div className="space-y-10 pb-20">
        {/* Welcome Section */}
        <GlassCard className="relative overflow-hidden !p-10">
          <div className="relative z-10 grid md:grid-cols-[1fr_auto] gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                Pulse Overview
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
                Welcome back, <span className="text-gradient">{(currentUser?.name || 'User').split(' ')[0]}</span>.
              </h1>
              <p className="text-slate-500 max-w-xl font-medium leading-relaxed">
                Nexora is running smoothly. All systems are green and your dashboard is up to date with the latest campus activity.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                {quickActions.map((action) => (
                  <Link 
                    key={action.path} 
                    to={action.path}
                    className="group bg-white border border-slate-200/60 hover:border-indigo-500/50 hover:bg-indigo-50/30 px-6 py-3 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-3"
                  >
                    <action.icon size={18} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-900">{action.label}</span>
                    <Plus size={14} className="text-slate-300 group-hover:text-indigo-500 group-hover:rotate-90 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="h-40 w-40 rounded-3xl bg-gradient-to-tr from-indigo-500 to-violet-500 rotate-12 flex items-center justify-center shadow-2xl shadow-indigo-200 animate-float">
                <Zap size={64} className="text-white drop-shadow-lg" />
              </div>
            </div>
          </div>
          {/* Decorative Gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        </GlassCard>

        {/* Stats Grid */}
        <AnimatedGrid staggerDelay={0.05}>
          {stats.map((stat, idx) => (
            <GlassCard key={idx} className="group hover:border-indigo-500/30">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500">
                  <stat.icon size={24} />
                </div>
                <div className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  {stat.trend}
                </div>
              </div>
              <div className="mt-6">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-4xl font-bold text-slate-900 mt-1 tabular-nums">{stat.value}</h3>
                <p className="text-xs text-slate-500 font-medium mt-2 flex items-center gap-1">
                  {stat.hint}
                  <ArrowUpRight size={12} className="text-emerald-500" />
                </p>
              </div>
            </GlassCard>
          ))}
        </AnimatedGrid>

        {/* Activity & Workflow */}
        <div className={`grid gap-8 ${currentUser.role === ROLES.USER ? 'grid-cols-1' : 'lg:grid-cols-2'}`}>
          <GlassCard className={`flex flex-col ${currentUser.role === ROLES.USER ? 'w-full' : ''}`}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Recent Notifications</h2>
                <p className="text-sm text-slate-500 font-medium">Synced in real-time</p>
              </div>
              <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center">
                <Bell size={20} className="text-slate-400" />
              </div>
            </div>
            
            <div className={`flex-1 overflow-auto pr-2 ${currentUser.role === ROLES.USER ? 'max-h-[600px]' : 'max-h-[400px]'}`}>
              {recentNotifications.length > 0 ? (
                <NotificationList notifications={recentNotifications} onRead={markAsRead} compact />
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-10 opacity-50">
                   <EmptyState
                    title="All caught up"
                    message="New notifications will appear here as they arrive."
                  />
                </div>
              )}
            </div>
            <Link to="/notifications" className="mt-6 text-center text-sm font-bold text-indigo-600 hover:text-indigo-700 transition">
              View All Alerts
            </Link>
          </GlassCard>

          {currentUser.role !== ROLES.USER && (
            <GlassCard className="flex flex-col justify-between overflow-hidden relative">
              <div className="space-y-4 relative z-10">
                <div className="h-12 w-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center">
                  <Zap size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Your Ecosystem Terminal</h2>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Looking for more control? Access your primary workspace terminal for detailed management tools, 
                  advanced analytics, and core campus orchestration.
                </p>
                <div className="pt-4">
                  <Link 
                    to={ROLE_HOME_PATHS[currentUser.role]} 
                    className="btn-primary w-full justify-center py-4 rounded-2xl group"
                  >
                    Enter {ROLE_LABELS[currentUser.role]} Dashboard
                    <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Link>
                </div>
              </div>
              
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
            </GlassCard>
          )}
        </div>
      </div>
    </PageContainer>
  )
}
