const reservations = [
  { name: 'Innovation Lab', time: '09:00 - 11:00', status: 'Confirmed' },
  { name: 'Seminar Room B', time: '11:30 - 12:30', status: 'Pending' },
  { name: 'Media Studio', time: '14:00 - 16:00', status: 'Available' },
]

function ReserveResource() {
  return (
    <section className="page-grid">
      <article className="hero-card">
        <p className="section-tag">Module 02</p>
        <h3>Reserve Resource</h3>
        <p>
          Coordinate campus bookings with a cleaner reservation flow for
          students, staff, and operations teams.
        </p>
        <div className="badge-row">
          <span className="info-badge">Booking calendar</span>
          <span className="info-badge">Conflict detection</span>
          <span className="info-badge">Usage insights</span>
        </div>
      </article>

      <article className="detail-card">
        <p className="section-tag">Today&apos;s Queue</p>
        <div className="table-list">
          {reservations.map((reservation) => (
            <div key={reservation.name} className="table-row">
              <div>
                <strong>{reservation.name}</strong>
                <span>{reservation.time}</span>
              </div>
              <span className="pill">{reservation.status}</span>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}

export default ReserveResource
