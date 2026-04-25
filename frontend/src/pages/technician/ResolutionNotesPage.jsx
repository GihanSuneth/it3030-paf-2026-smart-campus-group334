import { useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
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

  async function handleGenerateToken() {
    await ticketApi.generateRatingToken(ticketQuery.data.id, currentUser)
    await ticketQuery.refetch()
  }

  const qrValue = ticketQuery.data.ratingToken
    ? `${window.location.origin}/ticket-rating/${ticketQuery.data.id}?token=${encodeURIComponent(ticketQuery.data.ratingToken)}`
    : ''

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Resolution"
        title={ticketQuery.data.title}
        description="Fill the resolution details and save the ticket resolution."
      />

      <ResolutionNotesForm
        initialValues={{
          resolutionNotes: ticketQuery.data.resolutionNotes,
          configurationDone: ticketQuery.data.configurationDone,
          suggestions: ticketQuery.data.suggestions,
        }}
        onSave={handleSave}
        submitLabel="Save Resolution"
      />

      {['RESOLVED', 'CLOSED'].includes(ticketQuery.data.status) ? (
        <section className="panel space-y-4">
          <h2 className="text-xl font-semibold text-slate-950">Rating QR</h2>
          <p className="text-sm text-slate-600">
            Generate the QR after resolution. The user can scan it, see the token, and submit a rating for this ticket.
          </p>
          {ticketQuery.data.ratingToken ? (
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <QRCodeSVG size={180} value={qrValue} />
              <div className="text-center">
                <p className="text-xs font-black uppercase tracking-widest text-indigo-500">Token ID</p>
                <p className="mt-2 text-2xl font-black text-slate-950">{ticketQuery.data.ratingToken}</p>
              </div>
              <p className="text-center text-xs font-semibold text-slate-500 break-all">QR link: {qrValue}</p>
              {ticketQuery.data.rating ? (
                <p className="text-sm font-semibold text-emerald-600">
                  Rating received: {ticketQuery.data.rating}/5{ticketQuery.data.ratingFeedback ? ` - ${ticketQuery.data.ratingFeedback}` : ''}
                </p>
              ) : null}
            </div>
          ) : null}
          <button className="btn-primary w-full justify-center" type="button" onClick={handleGenerateToken}>
            {ticketQuery.data.ratingToken ? 'Regenerate QR Token' : 'Generate QR Token'}
          </button>
        </section>
      ) : null}

      <section className="panel space-y-3">
        <h2 className="text-xl font-semibold text-slate-950">Resource Details</h2>
        <div className="grid gap-3 md:grid-cols-2 text-sm text-slate-600">
          <p><span className="font-semibold text-slate-900">Resource:</span> {ticketQuery.data.resourceName}</p>
          <p><span className="font-semibold text-slate-900">Location:</span> {ticketQuery.data.location}</p>
          <p><span className="font-semibold text-slate-900">Contact Email:</span> {ticketQuery.data.contactEmail}</p>
          <p><span className="font-semibold text-slate-900">Cell Number:</span> {ticketQuery.data.contactPhone}</p>
        </div>
        {(ticketQuery.data.attachments || []).length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {ticketQuery.data.attachments.map((attachment, index) => (
              <img
                key={`${ticketQuery.data.id}-resolution-attachment-${index}`}
                alt={`Ticket evidence ${index + 1}`}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 object-cover"
                src={attachment}
              />
            ))}
          </div>
        ) : null}
      </section>

      {(ticketQuery.data.worklog || []).length > 0 ? (
        <section className="panel space-y-3">
          <h2 className="text-xl font-semibold text-slate-950">Worklog</h2>
          <div className="space-y-3">
            {ticketQuery.data.worklog.map((entry) => (
              <article key={entry.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">{entry.authorName}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">{entry.status}</p>
                <p className="mt-2 text-sm text-slate-600">{entry.note || 'No note added.'}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </PageContainer>
  )
}
