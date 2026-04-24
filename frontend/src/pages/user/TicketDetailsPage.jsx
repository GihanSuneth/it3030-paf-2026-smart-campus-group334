import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { authApi } from '../../api/authApi'
import { ticketApi } from '../../api/ticketApi'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { PageHeader } from '../../components/common/PageHeader'
import { PageContainer } from '../../components/layout/PageContainer'
import { ResolutionNotesForm } from '../../components/technician/ResolutionNotesForm'
import { TechnicianAssignmentPanel } from '../../components/technician/TechnicianAssignmentPanel'
import { TicketCommentList } from '../../components/tickets/TicketCommentList'
import { TicketStatusBadge } from '../../components/tickets/TicketStatusBadge'
import { ROLES } from '../../constants/roles'
import { useAuth } from '../../hooks/useAuth'
import { useMockQuery } from '../../hooks/useMockQuery'
import { ChevronLeft } from 'lucide-react'

export function TicketDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [comment, setComment] = useState('')
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

  async function handleCommentSubmit(event) {
    event.preventDefault()
    if (!comment.trim()) return
    await ticketApi.addComment(ticket.id, comment.trim(), currentUser)
    setComment('')
    await ticketQuery.refetch()
  }

  async function handleAssign(technicianId) {
    const technician = technicians.find((item) => item.id === technicianId)
    if (!technician) return
    await ticketApi.assignTechnician(ticket.id, technicianId, technician.name)
    await ticketQuery.refetch()
  }

  async function handleStatusChange(status) {
    await ticketApi.updateTicketStatus(ticket.id, status)
    await ticketQuery.refetch()
  }

  async function handleSaveResolution(note) {
    await ticketApi.addResolutionNotes(ticket.id, note)
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
        description="Review status, technician assignment, and discussion updates."
        actions={
          currentUser.role === ROLES.TECHNICIAN ? (
            <Link className="btn-primary" to={`/technician/tickets/${ticket.id}/update`}>
              Open Technician Update
            </Link>
          ) : null
        }
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

            <div className="space-y-2">
              <p className="text-sm font-bold text-slate-500">
                Reported by <span className="text-slate-900">{ticket.userName}</span>
              </p>
              <p className="text-sm font-bold text-slate-500">
                Location: <span className="text-slate-900">{ticket.location}</span>
              </p>
              <p className="text-base text-slate-700 leading-relaxed">{ticket.description}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 pt-4 border-t border-slate-100">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned Technician</p>
                <p className="text-sm font-bold text-indigo-600">
                  {ticket.technicianName || 'Pending assignment'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Resolution Notes</p>
                <p className="text-sm font-medium text-slate-700">
                  {ticket.resolutionNotes || 'No resolution notes yet.'}
                </p>
              </div>
            </div>
          </article>

          <article className="glass-card space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Support Discussion</h2>
              <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-widest italic leading-none">Latest updates</p>
            </div>

            {(ticket.comments || []).length > 0 ? (
              <TicketCommentList comments={ticket.comments} />
            ) : (
              <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-sm font-medium text-slate-500">No discussion updates yet.</p>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleCommentSubmit}>
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Post an update</span>
                <textarea
                  className="textarea !min-h-[160px]"
                  placeholder="Type your message here..."
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <button className="btn-primary !min-w-[200px]" type="submit">
                  Send Message
                </button>
              </div>
            </form>
          </article>
        </div>

        <div className="space-y-6">
          {currentUser.role === ROLES.ADMIN ? (
            <>
              <TechnicianAssignmentPanel technicians={technicians} onAssign={handleAssign} />
              <article className="glass-card space-y-4">
                <h2 className="text-lg font-bold text-slate-950">Administrative Control</h2>
                <div className="flex flex-col gap-3">
                  <button
                    className="btn-ghost justify-center font-bold"
                    type="button"
                    onClick={() => handleStatusChange('UNDER_REVIEW')}
                  >
                    Mark Under Review
                  </button>
                  <button
                    className="btn-ghost !border-rose-100 !text-rose-600 hover:!bg-rose-50 justify-center font-bold"
                    type="button"
                    onClick={() => handleStatusChange('REJECTED')}
                  >
                    Reject Ticket
                  </button>
                </div>
              </article>
            </>
          ) : null}

          {currentUser.role === ROLES.TECHNICIAN ? (
            <ResolutionNotesForm
              initialValue={ticket.resolutionNotes}
              onSave={handleSaveResolution}
            />
          ) : null}
        </div>
      </section>
    </PageContainer>
  )
}
