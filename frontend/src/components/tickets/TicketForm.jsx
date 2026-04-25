import { useState } from 'react'

import { getResourceCategory, RESOURCE_CATEGORIES } from '../../constants/resources'

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

/// A form for creating or editing a maintenance ticket. Can be used in different contexts (e.g. new ticket, edit existing ticket) by passing different onSubmit handlers and initial form state.
export function TicketForm({ resources, onSubmit, submitLabel = 'Create Ticket' }) {
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
      await onSubmit(formState)
      setFormState(initialState)
      setSuccess('Ticket submitted successfully.')
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setSubmitting(false)
    }
  }

  // When the user selects a resource, we automatically populate the location field based on that resource's data. This helps ensure accurate location info without relying on the user to input it manually.
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

        <div className="field-group space-y-6">
          <label className="space-y-2 block">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Problem Description</span>
            <textarea
              className="textarea"
              required
              placeholder="What specifically isn't working? Please provide as much detail as possible..."
              value={formState.description}
              onChange={(event) =>
                setFormState((current) => ({ ...current, description: event.target.value }))
              }
            />
          </label>
          <div className="grid gap-6 md:grid-cols-[1fr_1.5fr]">
            <label className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Urgency Level</span>
              <select
                className="input"
                value={formState.priority}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, priority: event.target.value }))
                }
              >
                <option value="LOW">LOW - Minor inconvenience</option>
                <option value="MEDIUM">MEDIUM - Affecting workflow</option>
                <option value="HIGH">HIGH - Critical failure</option>
              </select>
            </label>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Visual Evidence (Images)</span>
              <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 transition-all hover:bg-white hover:border-indigo-300">
                <input 
                  accept="image/*" 
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" 
                  multiple 
                  type="file" 
                  onChange={handleFiles} 
                />
                <p className="mt-2 text-[10px] text-slate-400 font-medium italic">Max 3 images. Photos of error messages or physical damage are helpful.</p>
                {formState.attachments.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formState.attachments.map((attachment) => (
                      <span key={attachment.name} className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white border border-slate-100 text-[10px] font-bold text-slate-600 shadow-sm">
                        {attachment.name}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
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
