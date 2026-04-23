import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { authApi } from '../../api/authApi'
import { ticketApi } from '../../api/ticketApi'
import { EmptyState } from '../../components/common/EmptyState'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { PageHeader } from '../../components/common/PageHeader'
import { PageContainer } from '../../components/layout/PageContainer'
import { ResolutionNotesForm } from '../../components/technician/ResolutionNotesForm'
import { TechnicianAssignmentPanel } from '../../components/technician/TechnicianAssignmentPanel'
import { TicketCommentList } from '../../components/tickets/TicketCommentList'
import { TicketStatusBadge } from '../../components/tickets/TicketStatusBadge'
import { ROLES } from '../../constants/roles'
import { TICKET_STATUSES } from '../../constants/statuses'
import { useAuth } from '../../hooks/useAuth'
import { useMockQuery } from '../../hooks/useMockQuery'
import { ChevronLeft, CheckCircle2, Circle, Clock, UserCheck, ShieldCheck, Star } from 'lucide-react'

export function TicketDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(0)
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

  const steps = [
    { label: 'Created', statuses: [TICKET_STATUSES.OPEN], icon: Clock },
    { label: 'Admin Reviewed', statuses: [TICKET_STATUSES.IN_PROGRESS, TICKET_STATUSES.RESOLVED], icon: ShieldCheck },
    { label: 'Technician Assigned', statuses: [TICKET_STATUSES.IN_PROGRESS, TICKET_STATUSES.RESOLVED], icon: UserCheck },
    { label: 'Resolved', statuses: [TICKET_STATUSES.RESOLVED], icon: CheckCircle2 },
  ]

  const currentStepIndex = ticket.status === TICKET_STATUSES.OPEN ? 0 : 
                          ticket.status === TICKET_STATUSES.REJECTED ? -1 : 
                          ticket.status === TICKET_STATUSES.IN_PROGRESS ? 2 : 3

  async function handleCommentSubmit(event) {
    event.preventDefault()
    if (!comment.trim()) return
    await ticketApi.addComment(ticket.id, comment.trim(), currentUser)
    setComment('')
    await ticketQuery.refetch()
  }

  async function handleAssign(technicianId) {
    if (!technicianId) return
    await ticketApi.assignTechnician(ticket.id, technicianId, currentUser)
    await ticketQuery.refetch()
  }

  async function handleStatusChange(status) {
    await ticketApi.updateTicketStatus(ticket.id, { status }, currentUser)
    await ticketQuery.refetch()
  }

  async function handleSaveResolution(note) {
    await ticketApi.addResolutionNotes(ticket.id, note, currentUser)
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
        description="Review status, comments, attachments, and role-specific actions."
        actions={
          currentUser.role === ROLES.TECHNICIAN ? (
            <Link className="btn-primary" to={`/technician/tickets/${ticket.id}/update`}>
              Open Technician Update
            </Link>
          ) : null
        }
      />

      {/* Ticket Status Visual Path */}
      <article className="glass-card mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-4">
          {steps.map((step, idx) => {
            const Icon = step.icon
            const isCompleted = currentStepIndex >= idx
            const isActive = currentStepIndex === idx
            
            return (
              <div key={step.label} className="flex flex-1 items-center w-full group">
                <div className="flex flex-col items-center gap-3 relative z-10">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                    isCompleted ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border-slate-200 text-slate-300'
                  } ${isActive ? 'ring-4 ring-indigo-50' : ''}`}>
                    <Icon size={22} />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest text-center ${isCompleted ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden md:block flex-1 h-[2px] mx-4 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 transition-all duration-700 ease-in-out" 
                      style={{ width: currentStepIndex > idx ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
        {ticket.status === TICKET_STATUSES.REJECTED && (
          <div className="mt-4 p-4 bg-rose-50 rounded-xl border border-rose-100 flex items-center gap-3">
            <ShieldCheck className="text-rose-600" />
            <p className="text-sm font-bold text-rose-700">Ticket Rejected: Administrator has declined this request.</p>
          </div>
        )}
      </article>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_22rem]">
        <div className="space-y-6">
          <article className="glass-card space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <TicketStatusBadge status={ticket.status} />
                <div className="h-4 w-px bg-slate-200" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">#{ticket.id.slice(0, 8)}</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                <span>Priority: <span className={ticket.priority === 'HIGH' ? 'text-rose-500' : 'text-indigo-500'}>{ticket.priority}</span></span>
                <span>Category: <span className="text-slate-900">{ticket.category}</span></span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-bold text-slate-500 flex items-center gap-2">
                <span className="p-1.5 bg-slate-100 rounded-lg text-slate-600 italic font-medium">@{ticket.location}</span>
                {ticket.resourceName}
              </p>
              <p className="text-base text-slate-700 leading-relaxed">{ticket.description}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 pt-4 border-t border-slate-100">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Requestor Detail</p>
                <p className="text-sm font-bold text-slate-900">{ticket.preferredContact}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Owner Assigned</p>
                <p className="text-sm font-bold text-indigo-600">
                  {ticket.assignedTechnicianName || 'Pending Triage...'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Evidence Attachments</p>
              {ticket.attachments.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {ticket.attachments.map((attachment) => (
                    <div key={attachment.name} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-600">
                      📎 {attachment.name}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">No attachments uploaded.</p>
              )}
            </div>
          </article>

          <article className="glass-card space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Support Discussion</h2>
              <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-widest italic leading-none">Real-time status updates</p>
            </div>
            
            {ticket.comments.length > 0 ? (
              <TicketCommentList comments={ticket.comments} />
            ) : (
              <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-sm font-medium text-slate-500">No discussion updates yet.</p>
              </div>
            )}

            {/* Satisfaction Rating System - Visible when resolved */}
            {ticket.status === TICKET_STATUSES.RESOLVED && currentUser.role === ROLES.USER && (
              <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <h3 className="text-sm font-bold text-indigo-900 mb-3">How was your service experience?</h3>
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      onClick={() => setRating(star)}
                      className={`p-1 transition-all ${rating >= star ? 'text-amber-400 scale-110' : 'text-indigo-200 hover:text-indigo-300'}`}
                    >
                      <Star size={24} fill={rating >= star ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
                <p className="text-xs font-medium text-indigo-600">Your feedback helps improve campus services.</p>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleCommentSubmit}>
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Post an update</span>
                <textarea
                  className="textarea !min-h-[160px]"
                  placeholder="Type your message here... Detailed reports help technicians work faster."
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
            <div className="space-y-6">
              <TechnicianAssignmentPanel technicians={technicians} onAssign={handleAssign} />
              <article className="glass-card space-y-4">
                <h2 className="text-lg font-bold text-slate-950">Administrative Control</h2>
                <div className="flex flex-col gap-3">
                  <button
                    className="btn-ghost !border-rose-100 !text-rose-600 hover:!bg-rose-50 justify-center font-bold"
                    type="button"
                    onClick={() => handleStatusChange(TICKET_STATUSES.CLOSED)}
                  >
                    Force Close Ticket
                  </button>
                  <button
                    className="btn-ghost !border-rose-100 !text-rose-600 hover:!bg-rose-50 justify-center font-bold"
                    type="button"
                    onClick={() => handleStatusChange(TICKET_STATUSES.REJECTED)}
                  >
                    Reject Application
                  </button>
                </div>
              </article>
            </div>
          ) : null}

          {currentUser.role === ROLES.TECHNICIAN ? (
            <ResolutionNotesForm
              initialValue={ticket.resolutionNotes}
              onSave={handleSaveResolution}
            />
          ) : null}

          <article className="glass-card space-y-4 border-l-4 border-indigo-500">
            <h2 className="text-lg font-bold text-slate-950">Technician Outcome</h2>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-sm font-medium leading-relaxed text-slate-600 italic">
                {ticket.resolutionNotes || 'Awaiting final resolution notes from the assigned technician...'}
              </p>
            </div>
          </article>
        </div>
      </section>
    </PageContainer>
  )
}
