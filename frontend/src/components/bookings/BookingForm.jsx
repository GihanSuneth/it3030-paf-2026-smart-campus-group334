import { useState } from 'react'
import { getResourceCategory, RESOURCE_CATEGORIES } from '../../constants/resources'

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

  const equipment = resources.filter(r => getResourceCategory(r.type) === RESOURCE_CATEGORIES.EQUIPMENT)
  const spaces = resources.filter(r => getResourceCategory(r.type) === RESOURCE_CATEGORIES.SPACES)

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
    <form className="form-shell" onSubmit={handleSubmit}>
      <div className="form-content">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="subtle-pill">Booking Request</span>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">Plan the session</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Keep the request concise and complete so administrators can review it quickly.
            </p>
          </div>
          <div className="info-band max-w-xs">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Review Tips</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Choose an active resource, confirm the timing, and describe the academic purpose clearly.
            </p>
          </div>
        </div>

        <div className="field-group space-y-4">
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
                {equipment.length > 0 && (
                  <optgroup label="Equipment">
                    {equipment.map((resource) => (
                      <option key={resource.id} value={resource.id}>
                        {resource.name}
                      </option>
                    ))}
                  </optgroup>
                )}
                {spaces.length > 0 && (
                  <optgroup label="Spaces">
                    {spaces.map((resource) => (
                      <option key={resource.id} value={resource.id}>
                        {resource.name}
                      </option>
                    ))}
                  </optgroup>
                )}
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
        </div>

        <div className="field-group space-y-4">
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
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {success ? <p className="text-sm text-emerald-600">{success}</p> : null}

        <div className="flex items-center justify-end">
          <button className="btn-primary min-w-44 justify-center" disabled={submitting} type="submit">
            {submitting ? 'Saving...' : submitLabel}
          </button>
        </div>
      </div>
    </form>
  )
}
