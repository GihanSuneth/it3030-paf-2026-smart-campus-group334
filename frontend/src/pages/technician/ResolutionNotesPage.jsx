import { Link, useParams } from 'react-router-dom'
import { ticketApi } from '../../api/ticketApi'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { PageHeader } from '../../components/common/PageHeader'
import { PageContainer } from '../../components/layout/PageContainer'
import { ResolutionNotesForm } from '../../components/technician/ResolutionNotesForm'
import { useAuth } from '../../hooks/useAuth'
import { useMockQuery } from '../../hooks/useMockQuery'

export function ResolutionNotesPage() {
  const { id } = useParams()
  const { currentUser } = useAuth()
  const ticketQuery = useMockQuery(() => ticketApi.getTicketById(id), [id])

  if (ticketQuery.loading) {
    return <LoadingState label="Loading resolution notes..." />
  }

  
  if (ticketQuery.error) {
    return <ErrorState message={ticketQuery.error} />
  }

  async function handleSave(note) {
    await ticketApi.addResolutionNotes(ticketQuery.data.id, note, currentUser)
    await ticketQuery.refetch()
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Resolution"
        title={ticketQuery.data.title}
        description="Add or update resolution details for the assigned ticket."
        actions={
          <Link className="btn-ghost" to={`/technician/tickets/${ticketQuery.data.id}/update`}>
            Update Status
          </Link>
        }
      />

      <ResolutionNotesForm
        initialValue={ticketQuery.data.resolutionNotes}
        onSave={handleSave}
      />

      {ticketQuery.data.worklog.length > 0 ? (
        <section className="panel space-y-3">
          <h2 className="text-xl font-semibold text-slate-950">Worklog</h2>
          <div className="space-y-3">
            {ticketQuery.data.worklog.map((entry) => (
              <article key={entry.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">{entry.authorName}</p>
                <p className="mt-2 text-sm text-slate-600">{entry.note}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </PageContainer>
  )
}
