import { useState } from 'react'

export function ResolutionNotesForm({
  initialValues = {
    resolutionNotes: '',
    configurationDone: '',
    suggestions: '',
  },
  onSave,
  submitLabel = 'Save Resolution',
}) {
  const [value, setValue] = useState({
    resolutionNotes: initialValues.resolutionNotes || '',
    configurationDone: initialValues.configurationDone || '',
    suggestions: initialValues.suggestions || '',
  })
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)

    try {
      await onSave(value)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="panel space-y-4" onSubmit={handleSubmit}>
      <h3 className="text-lg font-semibold text-slate-950">Resolution Notes</h3>

      <label className="space-y-2 block">
        <span className="text-sm font-semibold text-slate-700">Resolution Reason</span>
        <textarea
          className="textarea"
          rows="2"
          value={value.resolutionNotes}
          onChange={(event) =>
            setValue((current) => ({ ...current, resolutionNotes: event.target.value }))
          }
        />
      </label>

      <label className="space-y-2 block">
        <span className="text-sm font-semibold text-slate-700">Configuration Done</span>
        <textarea
          className="textarea"
          rows="2"
          value={value.configurationDone}
          onChange={(event) =>
            setValue((current) => ({ ...current, configurationDone: event.target.value }))
          }
        />
      </label>

      <label className="space-y-2 block">
        <span className="text-sm font-semibold text-slate-700">Other Suggestions</span>
        <textarea
          className="textarea"
          rows="2"
          value={value.suggestions}
          onChange={(event) =>
            setValue((current) => ({ ...current, suggestions: event.target.value }))
          }
        />
      </label>

      <button className="btn-primary w-full justify-center" disabled={saving} type="submit">
        {saving ? 'Saving...' : submitLabel}
      </button>
    </form>
  )
}
