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


export function AssignedTicketsPage() {
  const { currentUser } = useAuth()
  const { data, loading, error } = useMockQuery(
    () => ticketApi.getAssignedTickets(currentUser.id),
    [currentUser.id],
  )
  const [filter, setFilter] = useState('ALL') // ALL, OPEN, IN_PROGRESS, RESOLVED

  if (loading) {
    return <LoadingState label="Loading assigned tickets..." />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  const filteredTickets = data.filter(t => filter === 'ALL' || t.status === filter)

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Assigned Work"
        title="Assigned Tickets"
        description="Open the update flow or add resolution notes for any assigned job."
      />

      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit mb-8 overflow-x-auto max-w-full">
        {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map((status) => (
          <button 
            key={status}
            onClick={() => setFilter(status)}
            className={`px-6 py-2 rounded-[14px] text-xs font-bold transition-all whitespace-nowrap ${filter === status ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ')}
          </button>
        ))}
      </div>

      {filteredTickets.length > 0 ? (
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              href={`/technician/tickets/${ticket.id}`}
              ticket={ticket}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No assigned tickets"
          message="New assignments will appear here when the admin routes them to you."
        />
      )}
    </PageContainer>
  )
}
