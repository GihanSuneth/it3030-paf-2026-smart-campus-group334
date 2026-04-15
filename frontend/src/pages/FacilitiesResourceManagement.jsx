const metrics = [
  { label: 'Managed facilities', value: '24' },
  { label: 'Active assets', value: '186' },
  { label: 'Maintenance due', value: '09' },
]

const highlights = [
  'Track lecture halls, labs, transport, and shared campus utilities.',
  'Monitor resource availability with clear operational ownership.',
  'Surface maintenance priorities before they disrupt learning spaces.',
]

function FacilitiesResourceManagement() {
  return (
    <section className="page-grid">
      <article className="hero-card">
        <p className="section-tag">Module 01</p>
        <h3>Facilities & Resource Management</h3>
        <p>
          Keep every classroom, lab, and campus asset visible in one operating
          layer for faster planning and fewer blind spots.
        </p>
        <div className="metric-row">
          {metrics.map((metric) => (
            <div key={metric.label} className="metric-tile">
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      </article>

      <article className="detail-card">
        <p className="section-tag">Focus Areas</p>
        <ul className="feature-list">
          {highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
    </section>
  )
}

export default FacilitiesResourceManagement
