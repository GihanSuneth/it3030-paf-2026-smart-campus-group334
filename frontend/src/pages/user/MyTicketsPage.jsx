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

export function MyTicketsPage() {
  const { currentUser } = useAuth()
  const { data, loading, error } = useMockQuery(() => ticketApi.getMyTickets(currentUser.id), [
    currentUser.id,
  ])

  if (loading) {
    return <LoadingState label="Loading your tickets..." />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  const openCount = data.filter((ticket) => ['CREATED', 'UNDER_REVIEW', 'APPROVED'].includes(ticket.status)).length
  const processingCount = data.filter((ticket) => ['TECHNICIAN_ASSIGNED', 'RESOLVED'].includes(ticket.status)).length

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Support"
        title="My Tickets"
        description="Follow the current status of every issue you reported."
      />

      <section className="grid gap-4 md:grid-cols-3 mb-8">
        <StatCard 
          label="Reported Issues" 
          value={data.length} 
          hint="Total tickets submitted in this workflow."
        />
        <StatCard 
          label="Open Tickets" 
          value={openCount} 
          hint="Waiting for assignment or initial triage."
        />
        <StatCard 
          label="In Progress / Resolved" 
          value={processingCount} 
          hint="Technicians are currently working on these."
        />
      </section>

      {data.length > 0 ? (
        <div className="flex flex-col gap-5">
          {data.map((ticket) => (
            <div key={ticket.id} className="p-1">
              <TicketCard ticket={ticket} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No tickets yet"
          message="Reported issues will appear here after submission."
        />
      )}
    </PageContainer>
  )
}
