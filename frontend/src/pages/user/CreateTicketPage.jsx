import { ticketApi } from '../../api/ticketApi'
import { resourceApi } from '../../api/resourceApi'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { PageHeader } from '../../components/common/PageHeader'
import { PageContainer } from '../../components/layout/PageContainer'
import { TicketForm } from '../../components/tickets/TicketForm'
import { useAuth } from '../../hooks/useAuth'
import { useMockQuery } from '../../hooks/useMockQuery'

export function CreateTicketPage() {
  const { currentUser } = useAuth()
  const { data, loading, error } = useMockQuery(() => resourceApi.getResources(), [])

  if (loading) {
    return <LoadingState label="Preparing ticket form..." />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Support"
        title="Create Ticket"
        description="Report a maintenance or incident issue with location, priority, and attachments."
      />

      <TicketForm
        onSubmit={(payload) => ticketApi.createTicket(payload, currentUser)}
        resources={data}
      />
    </PageContainer>
  )
}
