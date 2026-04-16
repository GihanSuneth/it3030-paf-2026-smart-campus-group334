const incidents = [
  { issue: 'Network outage in Block C', level: 'High', owner: 'IT Ops' },
  { issue: 'Projector failure in Hall 4', level: 'Medium', owner: 'AV Team' },
  { issue: 'Access gate sensor alert', level: 'Low', owner: 'Security' },
]

function IncidentHandling() {
  return (
    <section className="page-grid">
      <article className="hero-card">
        <p className="section-tag">Module 03</p>
        <h3>Incident Handling</h3>
        <p>
          Capture issues quickly, route them to the right team, and keep campus
          services resilient during daily operations.
        </p>
        <div className="metric-row">
          <div className="metric-tile">
            <strong>18</strong>
            <span>Open incidents</span>
          </div>
          <div className="metric-tile">
            <strong>06</strong>
            <span>Resolved today</span>
          </div>
          <div className="metric-tile">
            <strong>34m</strong>
            <span>Avg. response</span>
          </div>
        </div>
      </article>

      <article className="detail-card">
        <p className="section-tag">Escalation Board</p>
        <div className="table-list">
          {incidents.map((incident) => (
            <div key={incident.issue} className="table-row">
              <div>
                <strong>{incident.issue}</strong>
                <span>{incident.owner}</span>
              </div>
              <span className="pill">{incident.level}</span>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}

export default IncidentHandling
