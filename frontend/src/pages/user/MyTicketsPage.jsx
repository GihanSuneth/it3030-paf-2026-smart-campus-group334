import { ticketApi } from '../../api/ticketApi'
import { EmptyState } from '../../components/common/EmptyState'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { PageHeader } from '../../components/common/PageHeader'
import { PageContainer } from '../../components/layout/PageContainer'
import { TicketCard } from '../../components/tickets/TicketCard'
import { useAuth } from '../../hooks/useAuth'
import { useMockQuery } from '../../hooks/useMockQuery'

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

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Support"
        title="My Tickets"
        description="Follow the current status of every issue you reported."
      />

      {data.length > 0 ? (
        <div className="space-y-4">
          {data.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
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
