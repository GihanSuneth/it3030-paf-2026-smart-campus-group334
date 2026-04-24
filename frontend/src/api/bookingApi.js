import { BOOKING_STATUSES } from '../constants/statuses'
import { simulateRequest } from './axios'

function toBookingPayload(payload, currentUser) {
  return {
    userId: currentUser.id,
    userName: currentUser.name,
    bookingType: payload.bookingType,
    resourceId: payload.resourceId,
    date: payload.date,
    startTime: payload.startTime,
    endTime: payload.endTime,
    purpose: payload.purpose,
    expectedAttendance: Number(payload.expectedAttendees),
  }
}

export const bookingApi = {
  getMyBookings(userId) {
    return simulateRequest({
      method: 'get',
      url: `/bookings/user/${userId}`,
    })
  },

  getAllBookings() {
    return simulateRequest({
      method: 'get',
      url: '/bookings',
    })
  },

  getPendingBookings() {
    return simulateRequest({
      method: 'get',
      url: '/bookings/pending',
    })
  },

  checkAvailability(payload, currentUser) {
    return simulateRequest({
      method: 'post',
      url: '/bookings/availability',
      data: toBookingPayload(payload, currentUser),
    })
  },

  createBooking(payload, currentUser) {
    return simulateRequest({
      method: 'post',
      url: '/bookings',
      data: toBookingPayload(payload, currentUser),
    })
  },

  approveBooking(bookingId) {
    return simulateRequest({
      method: 'post',
      url: `/bookings/${bookingId}/approve`,
    })
  },

  rejectBooking(bookingId, reason = '') {
    return simulateRequest({
      method: 'post',
      url: `/bookings/${bookingId}/reject`,
      data: { reason },
    })
  },

  cancelBooking(bookingId) {
    return simulateRequest({
      method: 'post',
      url: `/bookings/${bookingId}/cancel`,
    })
  },

  updateBookingStatus(bookingId, { status, rejectionReason }) {
    if (status === BOOKING_STATUSES.APPROVED) {
      return this.approveBooking(bookingId)
    }

    if (status === BOOKING_STATUSES.REJECTED) {
      return this.rejectBooking(bookingId, rejectionReason)
    }

    if (status === BOOKING_STATUSES.CANCELLED) {
      return this.cancelBooking(bookingId)
    }

    throw new Error(`Unsupported booking status: ${status}`)
  },
}
