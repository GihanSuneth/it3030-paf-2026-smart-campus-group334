import { useState } from 'react'

const initialState = {
  resourceId: '',
  date: '',
  startTime: '09:00',
  endTime: '11:00',
  purpose: '',
  expectedAttendees: 10,
}

export function BookingForm({ resources, onSubmit, submitLabel = 'Submit Booking' }) {
  const [formState, setFormState] = useState(initialState)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      await onSubmit({ ...formState, expectedAttendees: Number(formState.expectedAttendees) })
      setFormState(initialState)
      setSuccess('Booking request submitted successfully.')
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="panel space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Resource</span>
          <select
            className="input"
            required
            value={formState.resourceId}
            onChange={(event) =>
              setFormState((current) => ({ ...current, resourceId: event.target.value }))
            }
          >
            <option value="">Select a resource</option>
            {resources.map((resource) => (
              <option key={resource.id} value={resource.id}>
                {resource.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Date</span>
          <input
            className="input"
            required
            type="date"
            value={formState.date}
            onChange={(event) =>
              setFormState((current) => ({ ...current, date: event.target.value }))
            }
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Start time</span>
          <input
            className="input"
            required
            type="time"
            value={formState.startTime}
            onChange={(event) =>
              setFormState((current) => ({ ...current, startTime: event.target.value }))
            }
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">End time</span>
          <input
            className="input"
            required
            type="time"
            value={formState.endTime}
            onChange={(event) =>
              setFormState((current) => ({ ...current, endTime: event.target.value }))
            }
          />
        </label>
      </div>
      <label className="space-y-2">
        <span className="text-sm font-semibold text-slate-700">Purpose</span>
        <textarea
          className="textarea"
          required
          rows="4"
          value={formState.purpose}
          onChange={(event) =>
            setFormState((current) => ({ ...current, purpose: event.target.value }))
          }
        />
      </label>
      
      <label className="space-y-2">
        <span className="text-sm font-semibold text-slate-700">Expected attendees</span>
        <input
          className="input"
          min="1"
          required
          type="number"
          value={formState.expectedAttendees}
          onChange={(event) =>
            setFormState((current) => ({
              ...current,
              expectedAttendees: event.target.value,
            }))
          }
        />
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-600">{success}</p> : null}


      <button className="btn-primary w-full justify-center" disabled={submitting} type="submit">
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
   
   
  )
}
