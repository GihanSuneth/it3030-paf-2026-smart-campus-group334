import { useState } from 'react'

export function ResolutionNotesForm({ initialValue = '', onSave, submitLabel = 'Save Notes' }) {
  const [value, setValue] = useState(initialValue)
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
      <textarea
        className="textarea"
        rows="6"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <button className="btn-primary w-full justify-center" disabled={saving} type="submit">
        {saving ? 'Saving...' : submitLabel}
      </button>
    </form>
  )
}
