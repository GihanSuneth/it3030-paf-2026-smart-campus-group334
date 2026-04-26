import { useState } from 'react'

export function ResolutionNotesForm({ initialValue = '', onSave, submitLabel = 'Save Notes' }) {
  const [value, setValue] = useState(initialValue)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)// The handleSubmit function is an asynchronous function that is triggered when the form is submitted. It prevents the default form submission behavior, sets the saving state to true to indicate that the save operation is in progress, and then calls the onSave function with the current value of the resolution notes. The try-finally block ensures that the saving state is reset to false after the save operation completes, regardless of whether it was successful or if an error occurred, allowing the UI to reflect the completion of the save process appropriately.

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
