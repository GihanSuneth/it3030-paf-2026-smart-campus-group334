import { useState } from 'react'
import { bookingApi } from '../../api/bookingApi'
import { BookingCard } from '../../components/bookings/BookingCard'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import { PageHeader } from '../../components/common/PageHeader'
import { PageContainer } from '../../components/layout/PageContainer'
import { StatCard } from '../../components/common/StatCard'
import { useMockQuery } from '../../hooks/useMockQuery'
import { useAuth } from '../../hooks/useAuth'
import { CheckCircle2, XCircle } from 'lucide-react'

export function AllBookingsPage() {
  const { currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState('ALL') // ALL, PENDING
  const bookingsQuery = useMockQuery(() => bookingApi.getAllBookings(), [])

  if (bookingsQuery.loading) {
    return <LoadingState label="Loading booking records..." />
  }

  if (bookingsQuery.error) {
    return <ErrorState message={bookingsQuery.error} />
  }

  const bookings = bookingsQuery.data || []
  const pending = bookings.filter(b => b.status === 'PENDING')
  
  async function handleAction(id, status, reason = '') {
    await bookingApi.updateBookingStatus(id, { status, rejectionReason: reason }, currentUser)
    await bookingsQuery.refetch()
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Campus Logistics"
        title="Booking Handling"
        description="Monitor all space requests and prioritize pending approvals."
      />

      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit mb-8">
        {[
          { id: 'ALL', label: 'All Requests' },
          { id: 'PENDING', label: 'Pending Review' }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-[14px] text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {tab.label} {tab.id === 'PENDING' && pending.length > 0 && <span className="ml-2 px-1.5 py-0.5 bg-rose-100 text-rose-600 rounded-md text-[10px]">{pending.length}</span>}
          </button>
        ))}
      </div>

      <section className="grid gap-4 md:grid-cols-3 mb-8 animate-in fade-in slide-in-from-bottom-2">
        <StatCard label="Total Bookings" value={bookings.length} hint="Historical volume of requests." />
        <StatCard label="Queue Size" value={pending.length} hint="Current backlog for processing." />
        <StatCard label="Utilization" value={bookings.filter(b => b.status === 'APPROVED').length} hint="Active space reservations." />
      </section>

      <div className="pt-4 border-t border-slate-100 space-y-4 animate-in fade-in slide-in-from-bottom-2">
        {(activeTab === 'ALL' ? bookings : pending).map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            resourceName={booking.resourceName}
            actions={
              booking.status === 'PENDING' ? (
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleAction(booking.id, 'APPROVED')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-all border border-emerald-100 shadow-sm"
                  >
                    <CheckCircle2 size={14} /> Approve
                  </button>
                  <button 
                    onClick={() => handleAction(booking.id, 'REJECTED', 'Facility conflict or policy violation.')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-100 transition-all border border-rose-100 shadow-sm"
                  >
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              ) : null
            }
          />
        ))}
      </div>
    </PageContainer>
  )
}
