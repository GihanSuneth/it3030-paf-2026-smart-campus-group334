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

  if (loading) {
    return <LoadingState label="Loading assigned tickets..." />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Assigned Work"
        title="Assigned Tickets"
        description="Open the update flow or add resolution notes for any assigned job."
      />

      {data.length > 0 ? (
        <div className="space-y-4">
          {data.map((ticket) => (
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
