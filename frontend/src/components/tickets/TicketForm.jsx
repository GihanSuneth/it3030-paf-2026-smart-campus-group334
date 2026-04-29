import { useState } from 'react'

const initialState = {
  resourceId: '',
  resourceName: '',
  location: '',
  category: 'EQUIPMENT',
  title: '',
  description: '',
  priority: 'MEDIUM',
  contactEmail: '',
  contactPhone: '',
  attachments: [],
}

/// A form for creating or editing a maintenance ticket. Can be used in different contexts (e.g. new ticket, edit existing ticket) by passing different onSubmit handlers and initial form state.
export function TicketForm({ resources, onSubmit, submitLabel = 'Create Ticket' }) {
  const [formState, setFormState] = useState(initialState)
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}.`))
    reader.readAsDataURL(file)
  })
}

export function TicketForm({ resources, onSubmit, submitLabel = 'Submit Ticket', currentUser }) {
  const [formState, setFormState] = useState({
    ...initialState,
    contactEmail: currentUser?.email || '',
  })
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
      setFormState({
        ...initialState,
        contactEmail: currentUser?.email || '',
      })
      setSuccess('Ticket submitted successfully and routed for admin review.')
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
      resourceName: selectedResource?.name ?? '',
      location: selectedResource?.location ?? '',
      title: current.title || selectedResource?.name || '',
    }))
  }

  // For simplicity, we're not actually uploading files in this example. Instead, we just capture the file names and sizes to show how attachments could be handled in the form state. In a real implementation, you would need to handle file uploads to your server or a cloud storage service.
  function handleFiles(event) {
    const files = Array.from(event.target.files ?? [])
      .slice(0, 3)
      .map((file) => ({
        name: file.name,
        size: file.size,
      }))
  async function handleFiles(event) {
    const files = Array.from(event.target.files ?? []).slice(0, 3)

    try {
      const attachments = await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          size: file.size,
          content: await toBase64(file),
        }))
      )

      setFormState((current) => ({
        ...current,
        attachments: attachments.map((attachment) => attachment.content),
      }))
    } catch (fileError) {
      setError(fileError.message)
    }
  }

  // The form is organized into sections with clear labels and helper text to guide the user in providing all necessary information for the ticket. We use a combination of input fields, select dropdowns, and a textarea to capture different types of data. The submit button is disabled while the form is submitting to prevent duplicate submissions, and we display success or error messages based on the outcome of the submission.
  return (
    <form className="form-shell" onSubmit={handleSubmit}>
      <div className="form-content">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="subtle-pill">Issue Ticket</span>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">Raise a resource-related ticket</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Select the affected resource, add contact details, attach a photo if needed, and send it for admin review.
            </p>
          </div>
          <div className="info-band max-w-xs">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Ticket Flow</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Admin reviews the ticket first, then assigns a technician for follow-up and resolution.
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
                    {resource.name} ({resource.location})
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Category</span>
              <select
                className="input"
                required
                value={formState.category}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, category: event.target.value }))
                }
              >
                <option value="EQUIPMENT">Equipment</option>
                <option value="ACCESS">Access</option>
                <option value="FACILITY">Facility</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Issue Summary</span>
              <input
                className="input"
                required
                placeholder="Short issue title"
                value={formState.title}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, title: event.target.value }))
                }
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Location</span>
              <input
                className="input"
                required
                placeholder="Location"
                value={formState.location}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, location: event.target.value }))
                }
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Contact Email</span>
              <input
                className="input"
                required
                placeholder="Email"
                type="email"
                value={formState.contactEmail}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, contactEmail: event.target.value }))
                }
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Cell Number</span>
              <input
                className="input"
                required
                pattern="[0-9+ ]{8,15}"
                placeholder="07XXXXXXXX"
                value={formState.contactPhone}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, contactPhone: event.target.value }))
                }
              />
            </label>
          </div>
        </div>

        <div className="field-group space-y-6">
          <label className="space-y-2 block">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Brief Description</span>
            <textarea
              className="textarea"
              required
              placeholder="Describe the issue briefly and clearly."
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
                required
                value={formState.priority}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, priority: event.target.value }))
                }
              >
                <option value="LOW">LOW - Minor inconvenience</option>
                <option value="MEDIUM">MEDIUM - Affecting workflow</option>
                <option value="HIGH">HIGH - Critical failure</option>
                <option value="URGENT">URGENT - Immediate attention needed</option>
              </select>
            </label>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Issue Photo</span>
              <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 transition-all hover:bg-white hover:border-indigo-300">
                <input
                  accept="image/*"
                  className="w-full cursor-pointer text-xs text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-xs file:font-bold file:text-indigo-700 hover:file:bg-indigo-100"
                  multiple
                  type="file"
                  onChange={handleFiles}
                />
                <p className="mt-2 text-[10px] font-medium italic text-slate-400">
                  Upload up to 3 images. Photos help admins and technicians understand the issue faster.
                </p>
                {formState.attachments.length > 0 ? (
                  <p className="mt-3 text-xs font-semibold text-slate-600">
                    {formState.attachments.length} image{formState.attachments.length > 1 ? 's' : ''} attached.
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Error and success messages */}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {success ? <p className="text-sm text-emerald-600">{success}</p> : null}

        <div className="flex items-center justify-end">
          <button className="btn-primary min-w-44 justify-center" disabled={submitting} type="submit">
            {submitting ? 'Submitting...' : submitLabel}
          </button>
        </div>
      </div>
    </form>
  )
}
