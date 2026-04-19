import { BookingStatusBadge } from './BookingStatusBadge'

export function BookingCard({ booking, resourceName, actions }) {
  return (
    <article className="panel flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-lg font-semibold text-slate-950">{resourceName}</h3>
          <BookingStatusBadge status={booking.status} />
        </div>
        <p className="text-sm text-slate-500">
          {booking.date} · {booking.startTime} - {booking.endTime}
        </p>
        <p className="text-sm text-slate-600">{booking.purpose}</p>
        <p className="text-sm text-slate-500">Expected attendees: {booking.expectedAttendees}</p>
        {booking.rejectionReason ? (
          <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm text-red-700">
            Reason: {booking.rejectionReason}
          </p>
        ) : null}
        
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </article>
  )
}
