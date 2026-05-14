import { Link } from 'react-router-dom'
import { GlassCard } from '../../components/common/GlassCard'
import { ticketApi } from '../../api/ticketApi'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { PageHeader } from '../../components/common/PageHeader'
import { StatCard } from '../../components/common/StatCard'
import { PageContainer } from '../../components/layout/PageContainer'
import { useAuth } from '../../hooks/useAuth'
import { useMockQuery } from '../../hooks/useMockQuery'

function getHoursBetween(start, end) {
  if (!start || !end) return null

  const startDate = new Date(start)
  const endDate = new Date(end)
  const diff = endDate.getTime() - startDate.getTime()

  if (Number.isNaN(diff) || diff < 0) return null
  return diff / (1000 * 60 * 60)
}

function formatHours(value) {
  if (value == null) return '-'
  if (value < 1) return `${Math.round(value * 60)} mins`
  if (value < 24) return `${value.toFixed(1)} hrs`
  return `${(value / 24).toFixed(1)} days`
}

function startOfWeek(date) {
  const next = new Date(date)
  const day = next.getDay()
  const diff = day === 0 ? -6 : 1 - day
  next.setDate(next.getDate() + diff)
  next.setHours(0, 0, 0, 0)
  return next
}

function formatWeekLabel(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function buildWeeklyResolutionSeries(tickets) {
  const weeks = []
  const currentWeek = startOfWeek(new Date())

  for (let index = 5; index >= 0; index -= 1) {
    const weekStart = new Date(currentWeek)
    weekStart.setDate(currentWeek.getDate() - index * 7)
    weeks.push({
      key: weekStart.toISOString(),
      label: formatWeekLabel(weekStart),
      count: 0,
    })
  }

  tickets.forEach((ticket) => {
    const completedOn = ticket.resolvedAt || ticket.closedAt
    if (!completedOn) return

    const bucket = startOfWeek(new Date(completedOn)).toISOString()
    const match = weeks.find((week) => week.key === bucket)
    if (match) {
      match.count += 1
    }
  })

  return weeks
}

function buildBreakdown(items, key) {
  const counts = items.reduce((accumulator, item) => {
    const value = item[key] || 'UNKNOWN'
    accumulator[value] = (accumulator[value] || 0) + 1
    return accumulator
  }, {})

  return Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((left, right) => right.count - left.count)
}

export function TechnicianDashboardPage() {
  const { currentUser } = useAuth()
  const { data, loading, error } = useMockQuery(
    () => ticketApi.getAssignedTickets(currentUser.id),
    [currentUser.id],
  )

  if (loading) {
    return <LoadingState label="Loading technician dashboard..." />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  const tickets = data || []
  const highPriority = tickets.filter((ticket) => ['HIGH', 'URGENT'].includes(ticket.priority)).length
  const inProgress = tickets.filter((ticket) => ['ACKNOWLEDGED', 'IN_PROGRESS'].includes(ticket.status)).length
  const resolvedTickets = tickets.filter((ticket) => ['RESOLVED', 'CLOSED'].includes(ticket.status))
  const resolved = resolvedTickets.length
  const completionRate = tickets.length ? Math.round((resolved / tickets.length) * 100) : 0
  const ratedTickets = resolvedTickets.filter((ticket) => typeof ticket.rating === 'number')
  const averageRating = ratedTickets.length
    ? (ratedTickets.reduce((sum, ticket) => sum + ticket.rating, 0) / ratedTickets.length).toFixed(1)
    : null
  const averageResolutionHours = resolvedTickets
    .map((ticket) => getHoursBetween(ticket.assignedAt || ticket.createdAt, ticket.resolvedAt || ticket.closedAt))
    .filter((value) => value != null)
  const meanResolutionHours = averageResolutionHours.length
    ? averageResolutionHours.reduce((sum, value) => sum + value, 0) / averageResolutionHours.length
    : null
  const weeklyResolutions = buildWeeklyResolutionSeries(resolvedTickets)
  const peakResolutionWeek = [...weeklyResolutions].sort((left, right) => right.count - left.count)[0]
  const categoryBreakdown = buildBreakdown(tickets, 'category').slice(0, 4)
  const statusBreakdown = buildBreakdown(tickets, 'status').slice(0, 4)
  const topCategory = categoryBreakdown[0]
  const chartMax = Math.max(...weeklyResolutions.map((week) => week.count), 1)

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Technician Workspace"
        title="Technician Dashboard"
        description="Track assignments, repair progress, and your completed service workload."
        actions={
          <Link className="btn-primary" to="/technician/tickets">
            Open Assigned Tickets
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Assigned Tickets" value={tickets.length} hint="Total work routed to you." />
        <StatCard label="High Priority" value={highPriority} />
        <StatCard label="In Progress" value={inProgress} />
        <StatCard label="Resolved" value={resolved} hint={`${completionRate}% completion rate`} />
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Avg Resolution Time" value={formatHours(meanResolutionHours)} />
        <StatCard label="Average Rating" value={averageRating ? `${averageRating}/5` : '-'} hint="User feedback on resolved work." />
        <StatCard label="Peak Output Week" value={peakResolutionWeek?.count || 0} hint={peakResolutionWeek ? `Best week started ${peakResolutionWeek.label}` : 'No completed work yet.'} />
        <StatCard label="Top Category" value={topCategory?.label || '-'} hint={topCategory ? `${topCategory.count} tickets handled in this category.` : 'Waiting for assignments.'} />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <GlassCard className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-rose-500">Resolved Work Trend</p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Tickets completed over the last 6 weeks</h3>
            </div>
            <div className="rounded-2xl bg-rose-50 px-4 py-2 text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-500">Current Output</p>
              <p className="text-lg font-bold text-rose-900">{resolved} finished</p>
            </div>
          </div>

          <div className="mt-8 flex h-64 items-end gap-3">
            {weeklyResolutions.map((week) => {
              const barHeight = `${Math.max((week.count / chartMax) * 100, week.count > 0 ? 16 : 6)}%`
              return (
                <div key={week.key} className="flex flex-1 flex-col items-center gap-3">
                  <span className="text-xs font-semibold text-slate-500">{week.count}</span>
                  <div className="flex h-full w-full items-end rounded-3xl bg-slate-100/80 p-1.5">
                    <div
                      className="w-full rounded-[1.25rem] bg-gradient-to-t from-rose-500 via-orange-400 to-amber-300 shadow-[0_10px_20px_rgba(244,63,94,0.2)] transition-all duration-500"
                      style={{ height: barHeight }}
                    />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{week.label}</span>
                </div>
              )
            })}
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-indigo-500">Work Summary</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Performance snapshot</h3>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-indigo-50 px-4 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-500">Summary</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {resolved > 0
                  ? `${currentUser.name} has completed ${resolved} ticket${resolved > 1 ? 's' : ''} so far, with ${highPriority} high-priority case${highPriority === 1 ? '' : 's'} and ${inProgress} active repair${inProgress === 1 ? '' : 's'} currently in motion.`
                  : `${currentUser.name} has not completed a ticket yet. This panel will start showing throughput, response pace, and top issue types as work is resolved.`}
              </p>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-bold text-slate-900">Category mix</p>
                <p className="text-xs font-semibold text-slate-400">Top work types</p>
              </div>
              <div className="space-y-3">
                {categoryBreakdown.length > 0 ? categoryBreakdown.map((item) => {
                  const width = tickets.length ? `${(item.count / tickets.length) * 100}%` : '0%'
                  return (
                    <div key={item.label}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">{item.label}</span>
                        <span className="font-bold text-slate-900">{item.count}</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-400" style={{ width }} />
                      </div>
                    </div>
                  )
                }) : (
                  <p className="text-sm text-slate-500">No category analytics yet.</p>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-bold text-slate-900">Status distribution</p>
                <p className="text-xs font-semibold text-slate-400">Current pipeline</p>
              </div>
              <div className="grid gap-2">
                {statusBreakdown.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                    <span className="font-medium text-slate-600">{item.label.replaceAll('_', ' ')}</span>
                    <span className="font-bold text-slate-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </section>
    </PageContainer>
  )
}
