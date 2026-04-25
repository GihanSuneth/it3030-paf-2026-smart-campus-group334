import { useState } from 'react'
import { ticketApi } from '../../api/ticketApi'
import { EmptyState } from '../../components/common/EmptyState'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { PageHeader } from '../../components/common/PageHeader'
import { PageContainer } from '../../components/layout/PageContainer'
import { TicketCard } from '../../components/tickets/TicketCard'
import { useAuth } from '../../hooks/useAuth'
import { useMockQuery } from '../../hooks/useMockQuery'
import { StatCard } from '../../components/common/StatCard'

const FILTERS = [
  { id: 'ALL', label: 'All Tickets' },
  { id: 'OPEN', label: 'Open Tickets' },
  { id: 'ASSIGNED', label: 'Technician Assigned' },
  { id: 'REJECTED', label: 'Rejected' },
  { id: 'RESOLVED', label: 'Resolved / Closed' },
]

function matchesFilter(ticket, filter) {
  if (filter === 'ALL') return true
  if (filter === 'OPEN') return ['CREATED', 'UNDER_REVIEW'].includes(ticket.status)
  if (filter === 'ASSIGNED') return ['TECHNICIAN_ASSIGNED', 'ACKNOWLEDGED', 'IN_PROGRESS'].includes(ticket.status)
  if (filter === 'REJECTED') return ticket.status === 'REJECTED'
  if (filter === 'RESOLVED') return ['RESOLVED', 'CLOSED'].includes(ticket.status)
  return true
}

export function MyTicketsPage() {
  const { currentUser } = useAuth()
  const { data, loading, error } = useMockQuery(() => ticketApi.getMyTickets(currentUser.id), [
    currentUser.id,
  ])
  const [filter, setFilter] = useState('ALL')

  if (loading) {
    return <LoadingState label="Loading your tickets..." />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  const tickets = [...data].sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
  const openCount = tickets.filter((ticket) => ['CREATED', 'UNDER_REVIEW'].includes(ticket.status)).length
  const assignedCount = tickets.filter((ticket) => ['TECHNICIAN_ASSIGNED', 'ACKNOWLEDGED', 'IN_PROGRESS'].includes(ticket.status)).length
  const rejectedCount = tickets.filter((ticket) => ticket.status === 'REJECTED').length
  const resolvedCount = tickets.filter((ticket) => ['RESOLVED', 'CLOSED'].includes(ticket.status)).length
  const filteredTickets = tickets.filter((ticket) => matchesFilter(ticket, filter))

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Support"
        title="My Tickets"
        description="Track open tickets, technician assignments, rejected requests, and resolved issues."
      />

      <section className="grid gap-4 md:grid-cols-4 mb-8">
        <StatCard label="Open Tickets" value={openCount} hint="Submitted and waiting for assignment." />
        <StatCard label="Technician Assigned" value={assignedCount} hint="A technician is already handling these." />
        <StatCard label="Rejected Tickets" value={rejectedCount} hint="Tickets returned with admin comments." />
        <StatCard label="Resolved / Closed" value={resolvedCount} hint="Ready for review or final feedback." />
      </section>

      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit mb-8 overflow-x-auto max-w-full">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            onClick={() => setFilter(item.id)}
            className={`px-6 py-2 rounded-[14px] text-xs font-bold transition-all whitespace-nowrap ${filter === item.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {filteredTickets.length > 0 ? (
        <div className="flex flex-col gap-5">
          {filteredTickets.map((ticket) => (
            <div key={ticket.id} className="p-1">
              <TicketCard ticket={ticket} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No tickets in this view"
          message="Change the filter to see tickets in a different status."
        />
      )}
    </PageContainer>
  )
}
