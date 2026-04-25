import { Link } from 'react-router-dom'
import { bookingApi } from '../../api/bookingApi'
import { resourceApi } from '../../api/resourceApi'
import { ticketApi } from '../../api/ticketApi'
import { LoadingState } from '../../components/common/LoadingState'
import { ErrorState } from '../../components/common/ErrorState'
import { PageHeader } from '../../components/common/PageHeader'
import { StatCard } from '../../components/common/StatCard'
import { PageContainer } from '../../components/layout/PageContainer'
import { useMockQuery } from '../../hooks/useMockQuery'
import { LayoutDashboard, Users, Ticket, Calendar, Settings } from 'lucide-react'

export function AdminDashboardPage() {
  const resourcesQuery = useMockQuery(() => resourceApi.getResources(), [])
  const bookingsQuery = useMockQuery(() => bookingApi.getAllBookings(), [])
  const ticketsQuery = useMockQuery(() => ticketApi.getAllTickets(), [])

  if (resourcesQuery.loading || bookingsQuery.loading || ticketsQuery.loading) {
    return <LoadingState label="Loading admin dashboard..." />
  }

  if (resourcesQuery.error || bookingsQuery.error || ticketsQuery.error) {
    return <ErrorState message={resourcesQuery.error || bookingsQuery.error || ticketsQuery.error} />
  }

  const pendingBookings = (bookingsQuery.data || []).filter((item) => item.status === 'PENDING').length
  const openTickets = (ticketsQuery.data || []).filter((item) => item.status === 'OPEN').length
  const assignedTickets = (ticketsQuery.data || []).filter((item) => item.assignedTechnicianId).length
  const totalResources = (resourcesQuery.data || []).length

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Orchestration"
        title="Command Center"
        description="Unified telemetry and administrative controls for the smart campus ecosystem."
      />

      {/* Primary Operations Tray */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-8">
        <StatCard label="Service Throughput" value={ticketsQuery.data?.length || 0} hint="Total tickets in system." />
        <StatCard label="Booking Backlog" value={pendingBookings} hint="Requests awaiting approval." />
        <StatCard label="Triage Queue" value={openTickets} hint="New tickets needing assignment." />
        <StatCard label="Resource Status" value={totalResources} hint="Total monitored assets." />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
        <div className="space-y-6">
          <article className="glass-card">
            <div className="flex items-center gap-3 mb-6">
              <LayoutDashboard className="text-indigo-600" size={24} />
              <h2 className="text-xl font-bold text-slate-900">Operational Pulse</h2>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">Technician Coverage</p>
                <div className="flex items-end gap-2">
                   <h3 className="text-3xl font-bold text-slate-900">{assignedTickets}</h3>
                   <p className="text-xs font-medium text-slate-500 mb-1">active assignments</p>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                   <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(assignedTickets / (ticketsQuery.data?.length || 1)) * 100}%` }} />
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">Approval Velocity</p>
                <div className="flex items-end gap-2">
                   <h3 className="text-3xl font-bold text-slate-900">{Math.max(0, bookingsQuery.data?.length - pendingBookings)}</h3>
                   <p className="text-xs font-medium text-slate-500 mb-1">completed reviews</p>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
            </div>
          </article>
        </div>

        <aside className="space-y-6">
          <article className="glass-card !bg-indigo-600 !border-indigo-500 text-white shadow-xl shadow-indigo-100">
            <h2 className="text-lg font-bold mb-4">Command Actions</h2>
            <div className="flex flex-col gap-2.5">
              <Link to="/admin/resources" className="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all font-bold text-xs uppercase tracking-widest">
                <Settings size={16} /> Asset Engine
              </Link>
              <Link to="/admin/bookings" className="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all font-bold text-xs uppercase tracking-widest">
                <Calendar size={16} /> Booking Hub
              </Link>
              <Link to="/admin/tickets" className="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all font-bold text-xs uppercase tracking-widest">
                <Ticket size={16} /> Service Flow
              </Link>
              <Link to="/admin/users" className="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all font-bold text-xs uppercase tracking-widest">
                <Users size={16} /> IAM Console
              </Link>
            </div>
          </article>


        </aside>
      </div>
    </PageContainer>
  )
}
