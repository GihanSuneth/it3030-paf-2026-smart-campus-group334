import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
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

export function TicketDetailsPage() {
  const { id } = useParams()
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
      <PageHeader
        eyebrow="Ticket Details"
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

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_22rem]">
        <div className="space-y-6">
          <article className="panel space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <TicketStatusBadge status={ticket.status} />
              <span className="text-sm text-slate-500">Priority: {ticket.priority}</span>
              <span className="text-sm text-slate-500">Category: {ticket.category}</span>
            </div>
            <p className="text-sm text-slate-500">
              {ticket.resourceName} · {ticket.location}
            </p>
            <p className="text-base text-slate-600">{ticket.description}</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-slate-700">Contact</p>
                <p className="mt-1 text-sm text-slate-500">{ticket.preferredContact}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">Assigned Technician</p>
                <p className="mt-1 text-sm text-slate-500">
                  {ticket.assignedTechnicianName || 'Not assigned'}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700">Attachments</p>
              {ticket.attachments.length > 0 ? (
                <ul className="mt-2 space-y-2 text-sm text-slate-500">
                  {ticket.attachments.map((attachment) => (
                    <li key={attachment.name}>{attachment.name}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-slate-500">No attachments uploaded.</p>
              )}
            </div>
          </article>

          <article className="panel space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Comments</h2>
              <p className="mt-2 text-sm text-slate-500">
                Comment ownership is shown clearly for support tracking.
              </p>
            </div>
            {ticket.comments.length > 0 ? (
              <TicketCommentList comments={ticket.comments} />
            ) : (
              <EmptyState
                title="No comments yet"
                message="Add the first update to keep the ticket conversation moving."
              />
            )}

            <form className="space-y-3" onSubmit={handleCommentSubmit}>
              <textarea
                className="textarea"
                placeholder="Add a comment"
                rows="4"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
              />
              <button className="btn-primary" type="submit">
                Add Comment
              </button>
            </form>
          </article>
        </div>

        <div className="space-y-6">
          {currentUser.role === ROLES.ADMIN ? (
            <>
              <TechnicianAssignmentPanel technicians={technicians} onAssign={handleAssign} />
              <article className="panel space-y-4">
                <h2 className="text-lg font-semibold text-slate-950">Admin Actions</h2>
                <div className="flex flex-col gap-3">
                  <button
                    className="btn-ghost justify-center"
                    type="button"
                    onClick={() => handleStatusChange(TICKET_STATUSES.CLOSED)}
                  >
                    Close Ticket
                  </button>
                  <button
                    className="btn-ghost justify-center"
                    type="button"
                    onClick={() => handleStatusChange(TICKET_STATUSES.REJECTED)}
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

          <article className="panel space-y-3">
            <h2 className="text-lg font-semibold text-slate-950">Resolution Notes</h2>
            <p className="text-sm text-slate-500">
              {ticket.resolutionNotes || 'No resolution notes added yet.'}
            </p>
          </article>
        </div>
      </section>
    </PageContainer>
  )
}
