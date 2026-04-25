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

      <section className="page-grid">
        <TicketForm
          onSubmit={(payload) => ticketApi.createTicket(payload, currentUser)}
          resources={data}
        />
        <aside className="space-y-4">
          <article className="info-band">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Covered Resources</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{data.length}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">Choose the affected resource first so location context is carried into the report.</p>
          </article>
          <article className="section-panel">
            <h2 className="section-title">Write for fast triage</h2>
            <p className="mt-2 section-copy">
              State what failed, where it happened, and how urgent it is. Clear language improves response quality and speed.
            </p>
          </article>
        </aside>
      </section>
    </PageContainer>
  )
}
