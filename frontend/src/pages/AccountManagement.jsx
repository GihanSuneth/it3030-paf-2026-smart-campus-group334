const accountStats = [
  { label: 'Active users', value: '1,284' },
  { label: 'New requests', value: '17' },
  { label: 'Role updates', value: '08' },
]

function AccountManagement() {
  return (
    <section className="page-grid">
      <article className="hero-card">
        <p className="section-tag">Module 04</p>
        <h3>Account Management</h3>
        <p>
          Organize campus identities, roles, and permissions with a clearer view
          of access across the platform.
        </p>
        <div className="metric-row">
          {accountStats.map((stat) => (
            <div key={stat.label} className="metric-tile">
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </article>

      <article className="detail-card">
        <p className="section-tag">Administration</p>
        <ul className="feature-list">
          <li>Provision student, staff, and administrator accounts.</li>
          <li>Review access permissions before new semester rollouts.</li>
          <li>Standardize profile governance across all NEXORA modules.</li>
        </ul>
      </article>
    </section>
  )
}

export default AccountManagement
