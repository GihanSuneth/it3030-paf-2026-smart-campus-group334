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
import { downloadResourceUsagePdf } from '../../utils/resourceUsagePdf'
import { LayoutDashboard, Users, Ticket, Calendar, Settings, Download } from 'lucide-react'

function percent(part, whole) {
  if (!whole) return 0
  return Math.round((part / whole) * 100)
}

function usageRingStyle(value, color) {
  return {
    background: `conic-gradient(${color} 0 ${value}%, rgba(226,232,240,0.85) ${value}% 100%)`,
  }
}

function summarizeUsage(resources, bookings) {
  const allResources = resources || []
  const allBookings = bookings || []
  const activeBookingStatuses = ['APPROVED', 'PENDING']
  const bookedResourceIds = new Set(
    allBookings
      .filter((booking) => activeBookingStatuses.includes(booking.status))
      .map((booking) => booking.resourceId)
      .filter(Boolean)
  )

  const spaces = allResources.filter((resource) => resource.category === 'SPACE' || resource.capacity > 0)
  const equipment = allResources.filter((resource) => resource.category !== 'SPACE' && resource.capacity === 0)

  const workingEquipment = equipment.filter((resource) => {
    const status = (resource.status || '').toUpperCase()
    return resource.available !== false && ['WORKING', 'AVAILABLE', 'ACTIVE'].includes(status)
  })

  const assignedEquipment = equipment.filter((resource) => resource.assignedTo && resource.assignedTo !== 'Storage')

  const typeMap = allResources.reduce((accumulator, resource) => {
    const key = resource.type || 'Other'
    accumulator[key] = (accumulator[key] || 0) + 1
    return accumulator
  }, {})

  const typeBreakdown = Object.entries(typeMap)
    .map(([label, value]) => ({
      label,
      value,
      percent: percent(value, allResources.length),
    }))
    .sort((left, right) => right.value - left.value)
    .slice(0, 5)

  const summary = {
    space: {
      total: spaces.length,
      booked: spaces.filter((resource) => bookedResourceIds.has(resource.id)).length,
      available: spaces.filter((resource) => !bookedResourceIds.has(resource.id)).length,
    },
    equipment: {
      total: equipment.length,
      working: workingEquipment.length,
      assigned: assignedEquipment.length,
      maintenance: equipment.length - workingEquipment.length,
    },
    typeBreakdown,
  }

  return {
    ...summary,
    spaceUsagePercent: percent(summary.space.booked, summary.space.total),
    equipmentHealthPercent: percent(summary.equipment.working, summary.equipment.total),
    assignmentPercent: percent(summary.equipment.assigned, summary.equipment.total),
    equipmentBreakdown: [
      {
        label: 'Working units',
        value: summary.equipment.working,
        percent: percent(summary.equipment.working, summary.equipment.total),
      },
      {
        label: 'Assigned units',
        value: summary.equipment.assigned,
        percent: percent(summary.equipment.assigned, summary.equipment.total),
      },
      {
        label: 'Maintenance risk',
        value: summary.equipment.maintenance,
        percent: percent(summary.equipment.maintenance, summary.equipment.total),
      },
    ],
  }
}

function UsageBar({ label, value, percentValue, colorClass }) {
  return (
    <article className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        <p className="text-sm font-bold text-slate-950">{value}</p>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-200">
        <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${Math.max(percentValue, percentValue > 0 ? 8 : 0)}%` }} />
      </div>
    </article>
  )
}

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
  const openTickets = (ticketsQuery.data || []).filter((item) => ['CREATED', 'UNDER_REVIEW'].includes(item.status)).length
  const assignedTickets = (ticketsQuery.data || []).filter((item) => item.technicianId).length
  const totalResources = (resourcesQuery.data || []).length
  const usage = summarizeUsage(resourcesQuery.data, bookingsQuery.data)

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Orchestration"
        title="Command Center"
        description="Unified telemetry and administrative controls for the smart campus ecosystem."
        actions={
          <button className="btn-ghost" type="button" onClick={() => downloadResourceUsagePdf(usage)}>
            <Download size={16} />
            Download Usage PDF
          </button>
        }
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-8">
        <StatCard label="Service Throughput" value={ticketsQuery.data?.length || 0} hint="Total tickets in system." />
        <StatCard label="Booking Backlog" value={pendingBookings} hint="Requests awaiting approval." />
        <StatCard label="Triage Queue" value={openTickets} hint="New tickets needing assignment." />
        <StatCard label="Resource Status" value={totalResources} hint="Total monitored assets." />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
        <Link to="/admin/resources" className="rounded-[2rem] border border-indigo-500/20 bg-gradient-to-br from-indigo-600 to-indigo-500 p-5 text-white shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/25">
          <div className="flex items-center gap-3">
            <Settings className="text-white" size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Asset Engine</span>
          </div>
        </Link>
        <Link to="/admin/bookings" className="rounded-[2rem] border border-indigo-500/20 bg-gradient-to-br from-indigo-600 to-indigo-500 p-5 text-white shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/25">
          <div className="flex items-center gap-3">
            <Calendar className="text-white" size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Booking Hub</span>
          </div>
        </Link>
        <Link to="/admin/tickets" className="rounded-[2rem] border border-indigo-500/20 bg-gradient-to-br from-indigo-600 to-indigo-500 p-5 text-white shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/25">
          <div className="flex items-center gap-3">
            <Ticket className="text-white" size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Service Flow</span>
          </div>
        </Link>
        <Link to="/admin/users" className="rounded-[2rem] border border-indigo-500/20 bg-gradient-to-br from-indigo-600 to-indigo-500 p-5 text-white shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/25">
          <div className="flex items-center gap-3">
            <Users className="text-white" size={18} />
            <span className="text-xs font-black uppercase tracking-widest">IAM Console</span>
          </div>
        </Link>
      </section>

      <article className="glass-card space-y-6 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Usage Summary</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">Resource & Equipment Overview</h2>
          </div>
          <div className="rounded-full bg-indigo-50 px-4 py-2 text-xs font-black uppercase tracking-widest text-indigo-600">
            Visualized Live
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <article className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Space Usage</p>
            <div className="mt-5 flex items-center gap-5">
              <div className="relative h-28 w-28 rounded-full p-3" style={usageRingStyle(usage.spaceUsagePercent, '#4f46e5')}>
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-center">
                  <div>
                    <p className="text-2xl font-black text-slate-950">{usage.spaceUsagePercent}%</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">occupied</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <p><span className="font-semibold text-slate-900">{usage.space.booked}</span> spaces currently booked</p>
                <p><span className="font-semibold text-slate-900">{usage.space.available}</span> spaces currently free</p>
                <p><span className="font-semibold text-slate-900">{usage.space.total}</span> tracked spaces overall</p>
              </div>
            </div>
          </article>

          <article className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Equipment Health</p>
            <div className="mt-5 flex items-center gap-5">
              <div className="relative h-28 w-28 rounded-full p-3" style={usageRingStyle(usage.equipmentHealthPercent, '#10b981')}>
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-center">
                  <div>
                    <p className="text-2xl font-black text-slate-950">{usage.equipmentHealthPercent}%</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">working</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <p><span className="font-semibold text-slate-900">{usage.equipment.working}</span> working / available units</p>
                <p><span className="font-semibold text-slate-900">{usage.equipment.assigned}</span> assigned equipment units</p>
                <p><span className="font-semibold text-slate-900">{usage.equipment.maintenance}</span> units need attention</p>
              </div>
            </div>
          </article>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <article className="rounded-[2rem] border border-slate-200 bg-white p-5 space-y-4">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Resource Mix</p>
              <h3 className="mt-1 text-lg font-bold text-slate-950">Assets by Type</h3>
            </div>
            <div className="space-y-4">
              {usage.typeBreakdown.map((item) => (
                <UsageBar
                  key={item.label}
                  label={item.label}
                  value={`${item.value} (${item.percent}%)`}
                  percentValue={item.percent}
                  colorClass="bg-indigo-500"
                />
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-slate-200 bg-white p-5 space-y-4">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Equipment Snapshot</p>
              <h3 className="mt-1 text-lg font-bold text-slate-950">Working vs Assigned</h3>
            </div>
            <div className="space-y-4">
              <UsageBar
                label="Working Units"
                value={`${usage.equipment.working} (${usage.equipmentHealthPercent}%)`}
                percentValue={usage.equipmentHealthPercent}
                colorClass="bg-emerald-500"
              />
              <UsageBar
                label="Assigned Units"
                value={`${usage.equipment.assigned} (${usage.assignmentPercent}%)`}
                percentValue={usage.assignmentPercent}
                colorClass="bg-sky-500"
              />
              <UsageBar
                label="Maintenance Risk"
                value={`${usage.equipment.maintenance} (${percent(usage.equipment.maintenance, usage.equipment.total)}%)`}
                percentValue={percent(usage.equipment.maintenance, usage.equipment.total)}
                colorClass="bg-amber-500"
              />
            </div>
          </article>
        </div>
      </article>

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
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${percent(assignedTickets, ticketsQuery.data?.length || 1)}%` }} />
              </div>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">Approval Velocity</p>
              <div className="flex items-end gap-2">
                <h3 className="text-3xl font-bold text-slate-900">{Math.max(0, bookingsQuery.data?.length - pendingBookings)}</h3>
                <p className="text-xs font-medium text-slate-500 mb-1">completed reviews</p>
              </div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${percent(Math.max(0, bookingsQuery.data?.length - pendingBookings), bookingsQuery.data?.length || 1)}%` }} />
              </div>
            </div>
          </div>
        </article>

        <article className="glass-card space-y-4">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Summary Highlights</p>
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-900">Most active space signal</p>
              <p className="mt-2 text-sm text-slate-600">
                {usage.space.booked} of {usage.space.total} tracked spaces are in use through active bookings.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-900">Equipment readiness</p>
              <p className="mt-2 text-sm text-slate-600">
                {usage.equipment.working} of {usage.equipment.total} equipment units are ready for service right now.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-900">Assigned inventory</p>
              <p className="mt-2 text-sm text-slate-600">
                {usage.equipment.assigned} equipment items are already tied to active rooms or operational contexts.
              </p>
            </div>
          </div>
        </article>
      </div>
    </PageContainer>
  )
}
