import { useState } from 'react'

const initialState = {
  resourceId: '',
  location: '',
  category: 'Equipment',
  title: '',
  description: '',
  priority: 'MEDIUM',
  preferredContact: '',
  attachments: [],
}

export function TicketForm({ resources, onSubmit, submitLabel = 'Create Ticket' }) {
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
      await onSubmit(formState)
      setFormState(initialState)
      setSuccess('Ticket submitted successfully.')
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setSubmitting(false)
    }
  }

  function handleResourceChange(resourceId) {
    const selectedResource = resources.find((resource) => resource.id === resourceId)

    setFormState((current) => ({
      ...current,
      resourceId,
      location: selectedResource?.location ?? current.location,
    }))
  }

  function handleFiles(event) {
    const files = Array.from(event.target.files ?? [])
      .slice(0, 3)
      .map((file) => ({
        name: file.name,
        size: file.size,
      }))

    setFormState((current) => ({ ...current, attachments: files }))
  }

  return (
    <form className="form-shell" onSubmit={handleSubmit}>
      <div className="form-content">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="subtle-pill">Incident Report</span>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">Describe the issue clearly</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Good issue reports help technicians triage faster and reduce back-and-forth.
            </p>
          </div>
          <div className="info-band max-w-xs">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Best Practice</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Include the exact resource, what happened, and any visible evidence that could help diagnosis.
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
                onChange={(event) => handleResourceChange(event.target.value)}
              >
                <option value="">Choose a resource</option>
                {resources.map((resource) => (
                  <option key={resource.id} value={resource.id}>
                    {resource.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Category</span>
              <select
                className="input"
                value={formState.category}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, category: event.target.value }))
                }
              >
                <option value="Equipment">Equipment</option>
                <option value="Facilities">Facilities</option>
                <option value="Safety">Safety</option>
                <option value="Access">Access</option>
              </select>
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Title</span>
              <input
                className="input"
                required
                value={formState.title}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, title: event.target.value }))
                }
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Preferred contact</span>
              <input
                className="input"
                required
                value={formState.preferredContact}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    preferredContact: event.target.value,
                  }))
                }
              />
            </label>
          </div>
        </div>

        <div className="field-group space-y-4">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Description</span>
            <textarea
              className="textarea"
              required
              rows="5"
              value={formState.description}
              onChange={(event) =>
                setFormState((current) => ({ ...current, description: event.target.value }))
              }
            />
          </label>
          <div className="grid gap-4 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Priority</span>
              <select
                className="input"
                value={formState.priority}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, priority: event.target.value }))
                }
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Image attachments</span>
              <div className="rounded-[20px] border border-dashed border-slate-300 bg-slate-50 p-4">
                <input accept="image/*" className="w-full text-sm text-slate-500" multiple type="file" onChange={handleFiles} />
                <p className="mt-3 text-xs text-slate-500">Upload up to 3 images for the support team.</p>
                {formState.attachments.length > 0 ? (
                  <ul className="mt-3 space-y-1 text-sm text-slate-600">
                    {formState.attachments.map((attachment) => (
                      <li key={attachment.name}>{attachment.name}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </label>
          </div>
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
