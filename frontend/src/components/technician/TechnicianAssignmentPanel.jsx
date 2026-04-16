import { useState } from 'react'

export function TechnicianAssignmentPanel({ technicians, onAssign }) {
  const [technicianId, setTechnicianId] = useState('')

  return (
    <div className="panel space-y-4">
      <h3 className="text-lg font-semibold text-slate-950">Assign Technician</h3>
      <select
        className="input"
        value={technicianId}
        onChange={(event) => setTechnicianId(event.target.value)}
      >
        <option value="">Select technician</option>
        {technicians.map((technician) => (
          <option key={technician.id} value={technician.id}>
            {technician.name}
          </option>
        ))}
      </select>
      <button
        className="btn-primary w-full justify-center"
        type="button"
        onClick={() => onAssign(technicianId)}
      >
        Assign Technician
      </button>
    </div>
  )
}
