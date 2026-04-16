import { useNavigate, useParams } from 'react-router-dom'
import { ticketApi } from '../../api/ticketApi'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { PageHeader } from '../../components/common/PageHeader'
import { PageContainer } from '../../components/layout/PageContainer'
import { useAuth } from '../../hooks/useAuth'
import { useMockQuery } from '../../hooks/useMockQuery'
import { useState } from 'react'

export function UpdateTicketStatusPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { data, loading, error } = useMockQuery(() => ticketApi.getTicketById(id), [id])
  const [status, setStatus] = useState('IN_PROGRESS')
  const [note, setNote] = useState('')

  if (loading) {
    return <LoadingState label="Loading ticket update form..." />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    await ticketApi.updateTicketStatus(data.id, { status, note }, currentUser)
    navigate(`/technician/tickets/${data.id}`)
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Technician Update"
        title={`Update ${data.title}`}
        description="Record current progress and add a worklog note."
      />

      <form className="panel space-y-4" onSubmit={handleSubmit}>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Status</span>
          <select className="input" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Worklog Note</span>
          <textarea
            className="textarea"
            rows="5"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </label>
        <button className="btn-primary" type="submit">
          Save Update
        </button>
      </form>
    </PageContainer>
  )
}
