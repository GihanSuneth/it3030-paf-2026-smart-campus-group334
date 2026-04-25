import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useNavigate, useParams } from 'react-router-dom'
import { authApi } from '../../api/authApi'
import { ticketApi } from '../../api/ticketApi'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { PageHeader } from '../../components/common/PageHeader'
import { PageContainer } from '../../components/layout/PageContainer'
import { ResolutionNotesForm } from '../../components/technician/ResolutionNotesForm'
import { TechnicianAssignmentPanel } from '../../components/technician/TechnicianAssignmentPanel'
import { TicketStatusBadge } from '../../components/tickets/TicketStatusBadge'
import { ROLES } from '../../constants/roles'
import { useAuth } from '../../hooks/useAuth'
import { useMockQuery } from '../../hooks/useMockQuery'
import { ChevronLeft, Star } from 'lucide-react'

function formatStatusLabel(status) {
  return status?.toLowerCase().replaceAll('_', ' ')
}

function getRatingUrl(ticket) {
  if (!ticket?.id || !ticket?.ratingToken) return ''
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return `${origin}/ticket-rating/${ticket.id}?token=${encodeURIComponent(ticket.ratingToken)}`
}

export function TicketDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [adminNote, setAdminNote] = useState('')
  const [ratingTokenInput, setRatingTokenInput] = useState('')
  const [rating, setRating] = useState(5)
  const [ratingFeedback, setRatingFeedback] = useState('')
  const ticketQuery = useMockQuery(() => ticketApi.getTicketById(id), [id])
  const usersQuery = useMockQuery(() => authApi.getUsers(), [])

  if (ticketQuery.loading || usersQuery.loading) {
    return <LoadingState label="Loading ticket details..." />
  }

  if (ticketQuery.error || usersQuery.error) {
    return <ErrorState message={ticketQuery.error || usersQuery.error} />
  }

  const ticket = ticketQuery.data
  const technicians = usersQuery.data.filter((user) => user.role === ROLES.TECHNICIAN)
  const qrValue = getRatingUrl(ticket)

  async function handleAssign(technicianId) {
    const technician = technicians.find((item) => item.id === technicianId)
    if (!technician) return
    await ticketApi.assignTechnician(ticket.id, technicianId, technician.name)
    await ticketQuery.refetch()
  }

  async function handleStatusChange(status) {
    await ticketApi.updateTicketStatus(ticket.id, { status, note: adminNote }, currentUser)
    if (status === 'REJECTED') {
      setAdminNote('')
    }
    await ticketQuery.refetch()
  }

  async function handleSaveResolution(payload) {
    await ticketApi.addResolutionNotes(ticket.id, payload, currentUser)
    await ticketQuery.refetch()
  }

  async function handleAcceptResolution() {
    await ticketApi.acceptResolution(ticket.id, currentUser)
    await ticketQuery.refetch()
  }

  async function handleGenerateToken() {
    await ticketApi.generateRatingToken(ticket.id, currentUser)
    await ticketQuery.refetch()
  }

  async function handleSubmitRating(event) {
    event.preventDefault()
    await ticketApi.submitRating(ticket.id, {
      token: ratingTokenInput,
      rating,
      feedback: ratingFeedback,
    })
    setRatingFeedback('')
    await ticketQuery.refetch()
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ChevronLeft size={16} />
          Back to Tickets
        </button>
      </div>

      <PageHeader
        eyebrow="Ticket Tracking"
        title={ticket.title}
        description="Review status, contact details, technician assignment, uploaded photos, and the latest resolution updates."
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_22rem]">
        <div className="space-y-6">
          <article className="glass-card space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <TicketStatusBadge status={ticket.status} />
                <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-black text-white tracking-widest">
                  Ticket ID {ticket.ticketCode || ticket.id}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                <span>Priority: <span className={ticket.priority === 'HIGH' || ticket.priority === 'URGENT' ? 'text-rose-500' : 'text-indigo-500'}>{ticket.priority}</span></span>
                <span>Category: <span className="text-slate-900">{ticket.category}</span></span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-bold text-slate-500">
                  Reported by <span className="text-slate-900">{ticket.userName}</span>
                </p>
                <p className="text-sm font-bold text-slate-500">
                  Resource: <span className="text-slate-900">{ticket.resourceName || 'Not provided'}</span>
                </p>
                <p className="text-sm font-bold text-slate-500">
                  Location: <span className="text-slate-900">{ticket.location}</span>
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-bold text-slate-500">
                  Contact Email: <span className="text-slate-900">{ticket.contactEmail}</span>
                </p>
                <p className="text-sm font-bold text-slate-500">
                  Cell Number: <span className="text-slate-900">{ticket.contactPhone}</span>
                </p>
                <p className="text-sm font-bold text-slate-500">
                  Current Stage: <span className="text-slate-900">{formatStatusLabel(ticket.status)}</span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Brief Description</h2>
              <p className="text-base leading-relaxed text-slate-700">{ticket.description}</p>
            </div>

            {(ticket.attachments || []).length > 0 ? (
              <div className="space-y-3">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Uploaded Photos</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {ticket.attachments.map((attachment, index) => (
                    <img
                      key={`${ticket.id}-attachment-${index}`}
                      alt={`Ticket attachment ${index + 1}`}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 object-cover"
                      src={attachment}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            <div className="grid gap-6 md:grid-cols-2 pt-4 border-t border-slate-100">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned Technician</p>
                <p className="text-sm font-bold text-indigo-600">
                  {ticket.technicianName || 'Pending assignment'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Admin Decision</p>
                <p className="text-sm font-medium text-slate-700">
                  {ticket.rejectionReason ? `Rejected: ${ticket.rejectionReason}` : 'No rejection note.'}
                </p>
              </div>
            </div>
          </article>

          <article className="glass-card space-y-4">
            <h2 className="text-lg font-bold text-slate-950">Resolution Summary</h2>
            <div className="space-y-3 text-sm text-slate-700">
              <p><span className="font-semibold text-slate-900">Resolution Reason:</span> {ticket.resolutionNotes || 'Not added yet.'}</p>
              <p><span className="font-semibold text-slate-900">Configuration Done:</span> {ticket.configurationDone || 'Not added yet.'}</p>
              <p><span className="font-semibold text-slate-900">Other Suggestions:</span> {ticket.suggestions || 'Not added yet.'}</p>
            </div>
            {currentUser.role === ROLES.USER && ticket.status === 'RESOLVED' ? (
              <button className="btn-primary" type="button" onClick={handleAcceptResolution}>
                Accept Resolution And Close Ticket
              </button>
            ) : null}
          </article>

          {currentUser.role === ROLES.USER && ['RESOLVED', 'CLOSED'].includes(ticket.status) ? (
            <article className="glass-card space-y-4">
              <h2 className="text-lg font-bold text-slate-950">Rate Technician Service</h2>
              {ticket.ratingToken ? (
                <>
                  <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/60 p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-indigo-500">QR Session Token</p>
                    <div className="mt-4 flex justify-center">
                      <QRCodeSVG size={170} value={qrValue} />
                    </div>
                    <p className="mt-2 text-2xl font-black text-slate-950">{ticket.ratingToken}</p>
                    <p className="mt-2 text-sm text-slate-600">Scan the QR to open the rating page directly, or enter this token below manually.</p>
                    <p className="mt-3 text-xs font-semibold text-slate-500 break-all">QR link: {qrValue}</p>
                  </div>

                  {ticket.rating ? (
                    <p className="text-sm font-semibold text-emerald-600">
                      Rating submitted: {ticket.rating}/5{ticket.ratingFeedback ? ` - ${ticket.ratingFeedback}` : ''}
                    </p>
                  ) : (
                    <form className="space-y-4" onSubmit={handleSubmitRating}>
                      <label className="space-y-2 block">
                        <span className="text-sm font-semibold text-slate-700">Enter Token ID</span>
                        <input
                          className="input"
                          required
                          value={ratingTokenInput}
                          onChange={(event) => setRatingTokenInput(event.target.value.toUpperCase())}
                        />
                      </label>

                      <div className="space-y-2">
                        <span className="text-sm font-semibold text-slate-700">Star Rating</span>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <button
                              key={value}
                              className="rounded-full p-2 hover:bg-amber-50"
                              type="button"
                              onClick={() => setRating(value)}
                            >
                              <Star className={value <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} size={24} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <label className="space-y-2 block">
                        <span className="text-sm font-semibold text-slate-700">Suggestions</span>
                        <textarea
                          className="textarea"
                          rows="4"
                          value={ratingFeedback}
                          onChange={(event) => setRatingFeedback(event.target.value)}
                        />
                      </label>

                      <button className="btn-primary" type="submit">
                        Submit Rating
                      </button>
                    </form>
                  )}
                </>
              ) : (
                <p className="text-sm text-slate-600">The technician has not generated the rating token yet.</p>
              )}
            </article>
          ) : null}

          {(ticket.worklog || []).length > 0 ? (
            <article className="glass-card space-y-4">
              <h2 className="text-lg font-bold text-slate-950">Worklog</h2>
              <div className="space-y-3">
                {ticket.worklog.map((entry) => (
                  <article key={entry.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">{entry.authorName}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{entry.status}</p>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{entry.note || 'No note added.'}</p>
                  </article>
                ))}
              </div>
            </article>
          ) : null}
        </div>

        <div className="space-y-6">
          {currentUser.role === ROLES.ADMIN ? (
            <>
              <TechnicianAssignmentPanel technicians={technicians} onAssign={handleAssign} />
              <article className="glass-card space-y-4">
                <h2 className="text-lg font-bold text-slate-950">Administrative Control</h2>
                <div className="space-y-3">
                  <button
                    className="btn-ghost justify-center font-bold"
                    type="button"
                    onClick={() => handleStatusChange('UNDER_REVIEW')}
                  >
                    Mark Under Review
                  </button>

                  <label className="space-y-2 block">
                    <span className="text-sm font-semibold text-slate-700">Reject Note</span>
                    <textarea
                      className="textarea"
                      rows="4"
                      value={adminNote}
                      onChange={(event) => setAdminNote(event.target.value)}
                    />
                  </label>

                  <button
                    className="btn-ghost !border-rose-100 !text-rose-600 hover:!bg-rose-50 justify-center font-bold"
                    type="button"
                    onClick={() => handleStatusChange('REJECTED')}
                  >
                    Reject Ticket With Note
                  </button>
                </div>
              </article>
            </>
          ) : null}

          {currentUser.role === ROLES.TECHNICIAN ? (
            <>
              <ResolutionNotesForm
                initialValues={{
                  resolutionNotes: ticket.resolutionNotes,
                  configurationDone: ticket.configurationDone,
                  suggestions: ticket.suggestions,
                }}
                onSave={handleSaveResolution}
              />

              {['RESOLVED', 'CLOSED'].includes(ticket.status) ? (
                <article className="glass-card space-y-4">
                  <h2 className="text-lg font-bold text-slate-950">QR Rating Session</h2>
                  <p className="text-sm text-slate-600">
                    Generate the token after resolution. The user will see it inside this ticket and can submit the service rating.
                  </p>
                  {ticket.ratingToken ? (
                    <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/60 p-4">
                      <p className="text-xs font-black uppercase tracking-widest text-indigo-500">Generated Token</p>
                      <div className="mt-4 flex justify-center">
                        <QRCodeSVG size={170} value={qrValue} />
                      </div>
                      <p className="mt-2 text-2xl font-black text-slate-950">{ticket.ratingToken}</p>
                      <p className="mt-2 text-xs font-semibold text-slate-500 break-all">QR link: {qrValue}</p>
                    </div>
                  ) : null}
                  <button className="btn-primary" type="button" onClick={handleGenerateToken}>
                    {ticket.ratingToken ? 'Regenerate Token' : 'Generate Rating Token'}
                  </button>
                  {ticket.rating ? (
                    <p className="text-sm font-semibold text-emerald-600">
                      Current rating: {ticket.rating}/5{ticket.ratingFeedback ? ` - ${ticket.ratingFeedback}` : ''}
                    </p>
                  ) : null}
                </article>
              ) : null}
            </>
          ) : null}
        </div>
      </section>
    </PageContainer>
  )
}
