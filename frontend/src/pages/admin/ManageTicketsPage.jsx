import { Link } from 'react-router-dom'
import { ticketApi } from '../../api/ticketApi'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { PageHeader } from '../../components/common/PageHeader'
import { PageContainer } from '../../components/layout/PageContainer'
import { TicketCard } from '../../components/tickets/TicketCard'
import { useMockQuery } from '../../hooks/useMockQuery'

export function ManageTicketsPage() {
  const { data, loading, error } = useMockQuery(() => ticketApi.getAllTickets(), [])

  if (loading) {
    return <LoadingState label="Loading tickets..." />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Ticket Operations"
        title="Manage Tickets"
        description="View all ticket records and open the detail screen for actions."
        actions={
          <Link className="btn-primary" to="/admin/tickets/assign">
            Assign Technicians
          </Link>
        }
      />

      <div className="space-y-4">
        {data.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </PageContainer>
  )
}
