import { BookingStatusBadge } from './BookingStatusBadge'

export function BookingCard({ booking, resourceName, actions }) {
  const expectedAttendance = booking.expectedAttendance ?? booking.expectedAttendees

  return (
    <article className="glass-card flex flex-col md:flex-row items-center gap-6 p-5 cursor-pointer group hover-lift">
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <BookingStatusBadge status={booking.status} />
          <h3 className="text-lg font-bold text-slate-950 truncate">{resourceName}</h3>
          {booking.bookingCode ? (
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest hidden sm:inline">
              {booking.bookingCode}
            </span>
          ) : (
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest hidden sm:inline">
              #{booking.id.slice(0, 8)}
            </span>
          )}
        </div>
        
        <p className="text-sm font-bold text-indigo-600 flex items-center gap-2">
          {booking.date} <span className="h-1 w-1 bg-slate-300 rounded-full" /> {booking.startTime} - {booking.endTime}
        </p>

        <p className="text-sm text-slate-600 leading-relaxed italic line-clamp-1">"{booking.purpose}"</p>
        
        <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span>Attendees: <span className="text-slate-600">{expectedAttendance ?? '-'}</span></span>
          {booking.reviewComment && (
             <span className={booking.status === 'REJECTED' ? 'text-rose-500 font-black' : 'text-slate-500 font-black'}>
               {booking.status === 'REJECTED' ? 'REJECTED' : 'NOTE'}: {booking.reviewComment}
             </span>
          )}
        </div>
      </div>

      <div className="flex-shrink-0 w-full md:w-auto">
        {actions ? <div className="flex flex-col gap-2">{actions}</div> : (
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Read Only Mode</span>
        )}
      </div>
    </article>
  )
}
