import { useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { ticketApi } from '../../api/ticketApi'

export function TicketRatingPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const [rating, setRating] = useState(5)
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const token = useMemo(() => searchParams.get('token') || '', [searchParams])

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      await ticketApi.submitRating(id, { token, rating, feedback })
      setSuccess('Thanks for rating the technician service.')
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <section className="mx-auto max-w-xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-indigo-500">Service Rating</p>
        <h1 className="mt-3 text-4xl font-black text-slate-950">Rate Technician Support</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Share how the technician handled ticket service, communication, and resolution quality.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="space-y-2 block">
            <span className="text-sm font-semibold text-slate-700">Rating</span>
            <select className="input" value={rating} onChange={(event) => setRating(Number(event.target.value))}>
              <option value={5}>5 - Excellent</option>
              <option value={4}>4 - Good</option>
              <option value={3}>3 - Satisfactory</option>
              <option value={2}>2 - Needs improvement</option>
              <option value={1}>1 - Poor</option>
            </select>
          </label>

          <label className="space-y-2 block">
            <span className="text-sm font-semibold text-slate-700">Feedback</span>
            <textarea
              className="textarea"
              placeholder="Optional feedback for the technician"
              rows="5"
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
            />
          </label>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-600">{success}</p> : null}

          <button className="btn-primary w-full justify-center" disabled={!token || submitting} type="submit">
            {submitting ? 'Submitting...' : 'Submit Rating'}
          </button>
        </form>
      </section>
    </main>
  )
}
