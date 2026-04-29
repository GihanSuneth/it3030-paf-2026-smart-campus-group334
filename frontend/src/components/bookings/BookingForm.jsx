import { useEffect, useMemo, useState } from 'react'
import { getResourceCategory, RESOURCE_CATEGORIES } from '../../constants/resources'

const initialState = {
  bookingType: RESOURCE_CATEGORIES.SPACES,
  resourceId: '',
  date: '',
  startTime: '09:00',
  endTime: '11:00',
  purpose: '',
  expectedAttendees: 10,
}

export function BookingForm({
  resources,
  onSubmit,
  onCheckAvailability,
  submitLabel = 'Submit Booking',
  initialResourceId = '',
  initialBookingType = RESOURCE_CATEGORIES.SPACES,
}) {
  const [formState, setFormState] = useState({
    ...initialState,
    bookingType: initialBookingType,
    resourceId: initialResourceId,
  })
  const [submitting, setSubmitting] = useState(false)
  const [checkingAvailability, setCheckingAvailability] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [availability, setAvailability] = useState(null)
  const [hasCheckedAvailability, setHasCheckedAvailability] = useState(false)

  const equipment = resources.filter(
    (resource) => getResourceCategory(resource.type, resource.category) === RESOURCE_CATEGORIES.EQUIPMENT,
  )
  const spaces = resources.filter(
    (resource) => getResourceCategory(resource.type, resource.category) === RESOURCE_CATEGORIES.SPACES,
  )
  const visibleResources = formState.bookingType === RESOURCE_CATEGORIES.EQUIPMENT ? equipment : spaces
  const selectedResource = useMemo(
    () => resources.find((resource) => resource.id === formState.resourceId) || null,
    [resources, formState.resourceId],
  )

  useEffect(() => {
    setFormState((current) => ({
      ...current,
      bookingType: initialBookingType,
      resourceId: initialResourceId,
    }))
    setAvailability(null)
    setHasCheckedAvailability(false)
    setError('')
    setSuccess('')
  }, [initialBookingType, initialResourceId])

  useEffect(() => {
    setAvailability(null)
    setHasCheckedAvailability(false)
    setError('')
    setSuccess('')
  }, [
    formState.bookingType,
    formState.resourceId,
    formState.date,
    formState.startTime,
    formState.endTime,
    formState.expectedAttendees,
  ])

  const today = new Date().toISOString().split('T')[0]

  async function handleAvailabilityCheck() {
    setCheckingAvailability(true)
    setError('')
    setSuccess('')

    try {
      validateFormState()
      const result = await onCheckAvailability({
        ...formState,
        expectedAttendees: Number(formState.expectedAttendees),
      })
      setAvailability(result)
      setHasCheckedAvailability(true)
      setSuccess(result.available ? result.message : '')
      if (!result.available) {
        setError(result.conflictDetails ? `${result.message} ${result.conflictDetails}` : result.message)
        window.alert(result.conflictDetails ? `${result.message}\n${result.conflictDetails}` : result.message)
      } else {
        window.alert(result.message)
      }
    } catch (availabilityError) {
      setAvailability(null)
      setHasCheckedAvailability(false)
      setError(availabilityError.message)
      window.alert(availabilityError.message)
    } finally {
      setCheckingAvailability(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      validateFormState()

      if (!hasCheckedAvailability) {
        throw new Error('Check availability before submitting the booking request.')
      }

      if (!availability?.available) {
        throw new Error('Resolve the booking conflict or choose an alternative resource before submitting.')
      }

      await onSubmit({ ...formState, expectedAttendees: Number(formState.expectedAttendees) })
      setFormState({
        ...initialState,
        bookingType: initialBookingType,
        resourceId: '',
      })
      setAvailability(null)
      setHasCheckedAvailability(false)
      setSuccess('Booking request submitted successfully.')
      window.alert('Booking request submitted successfully. Admin will review it next.')
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setSubmitting(false)
    }
  }

  function validateFormState() {
    if (!formState.bookingType) {
      throw new Error('Booking type is required.')
    }

    if (!formState.resourceId) {
      throw new Error('Select a resource or equipment.')
    }

    if (!formState.date) {
      throw new Error('Booking date is required.')
    }

    if (!formState.startTime) {
      throw new Error('Start time is required.')
    }

    if (!formState.endTime) {
      throw new Error('End time is required.')
    }

    if (!formState.purpose.trim()) {
      throw new Error('Booking purpose is required.')
    }

    if (!Number(formState.expectedAttendees) || Number(formState.expectedAttendees) <= 0) {
      throw new Error('Expected attendees must be greater than zero.')
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
              <span className="text-sm font-semibold text-slate-700">Booking type</span>
              <select
                className="input"
                value={formState.bookingType}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    bookingType: event.target.value,
                    resourceId: '',
                  }))
                }
              >
                <option value={RESOURCE_CATEGORIES.SPACES}>Space</option>
                <option value={RESOURCE_CATEGORIES.EQUIPMENT}>Physical Resource</option>
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Resource</span>
              <select
                className="input"
                required
                value={formState.resourceId}
                onChange={(event) => {
                  setAvailability(null)
                  setFormState((current) => ({ ...current, resourceId: event.target.value }))
                }}
              >
                <option value="">Select a resource</option>
                {visibleResources.map((resource) => (
                  <option key={resource.id} value={resource.id}>
                    {resource.name} ({resource.code})
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
                min={today}
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

        {selectedResource ? (
          <div className="field-group space-y-4">
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
              <p className="text-sm font-semibold text-slate-900">Selected resource details</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Resource</p>
                  <p className="mt-1 text-sm text-slate-700">{selectedResource.name}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Location</p>
                  <p className="mt-1 text-sm text-slate-700">{selectedResource.location}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Code</p>
                  <p className="mt-1 text-sm text-slate-700">{selectedResource.code}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Status</p>
                  <p className="mt-1 text-sm text-slate-700">{selectedResource.status}</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

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

        <div className="field-group space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">Availability check</p>
              <p className="text-sm text-slate-500">
                Validate conflicts and get alternative suggestions before submitting for admin review.
              </p>
            </div>
            <button
              className="btn-secondary min-w-48 justify-center"
              disabled={checkingAvailability || !formState.resourceId || !formState.date}
              onClick={handleAvailabilityCheck}
              type="button"
            >
              {checkingAvailability ? 'Checking...' : 'Check Availability'}
            </button>
          </div>

          {availability && !availability.available && availability.suggestedResources?.length > 0 ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-900">Suggested alternatives</p>
              <div className="mt-3 grid gap-3">
                {availability.suggestedResources.map((resource) => (
                  <button
                    key={resource.resourceId}
                    className="rounded-xl border border-amber-200 bg-white px-4 py-3 text-left transition hover:border-amber-400"
                    onClick={() =>
                      setFormState((current) => ({
                        ...current,
                        resourceId: resource.resourceId,
                      }))
                    }
                    type="button"
                  >
                    <p className="text-sm font-semibold text-slate-900">{resource.resourceName}</p>
                    <p className="text-xs text-slate-500">
                      {resource.resourceCode} • {resource.location} • capacity {resource.capacity}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {availability?.occupiedSlots?.length > 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">Occupied time windows on selected date</p>
              <div className="mt-3 grid gap-3">
                {availability.occupiedSlots.map((slot) => (
                  <div key={slot.bookingId} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">
                      {slot.bookingCode || slot.bookingId} • {slot.startTime} - {slot.endTime}
                    </p>
                    <p className="text-xs text-slate-500">
                      {slot.status} {slot.purpose ? `• ${slot.purpose}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {availability?.available ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-900">Availability confirmed</p>
              <p className="mt-1 text-sm text-emerald-800">{availability.message}</p>
            </div>
          ) : null}

          {availability?.conflictDetails ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
              <p className="text-sm font-semibold text-rose-900">Conflict details</p>
              <p className="mt-1 text-sm text-rose-800">{availability.conflictDetails}</p>
            </div>
          ) : null}
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
