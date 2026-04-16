import { BOOKING_STATUSES } from '../constants/statuses'
import { ROLES } from '../constants/roles'
import { appendNotification, mutateDatabase, readDatabase } from '../mock/database'
import { simulateRequest } from './axios'

function hasOverlap(leftStart, leftEnd, rightStart, rightEnd) {
  return leftStart < rightEnd && rightStart < leftEnd
}

export const bookingApi = {
  getMyBookings(userId) {
    return simulateRequest({
      method: 'get',
      url: '/bookings/me',
      handler: () =>
        readDatabase().bookings.filter((booking) => booking.requestedById === userId),
    })
  },

  getAllBookings() {
    return simulateRequest({
      method: 'get',
      url: '/bookings',
      handler: () => readDatabase().bookings,
    })
  },

  getPendingBookings() {
    return simulateRequest({
      method: 'get',
      url: '/bookings/pending',
      handler: () =>
        readDatabase().bookings.filter(
          (booking) => booking.status === BOOKING_STATUSES.PENDING,
        ),
    })
  },

  createBooking(payload, currentUser) {
    return simulateRequest({
      method: 'post',
      url: '/bookings',
      handler: () => {
        if (currentUser?.role !== ROLES.USER) {
          throw new Error('Only users can create bookings.')
        }

        if (payload.startTime >= payload.endTime) {
          throw new Error('End time must be later than the start time.')
        }

        return mutateDatabase((database) => {
          const resource = database.resources.find((item) => item.id === payload.resourceId)

          if (!resource || resource.status !== 'ACTIVE') {
            throw new Error('This resource is not available right now.')
          }

          const conflictingBooking = database.bookings.find(
            (booking) =>
              booking.resourceId === payload.resourceId &&
              booking.date === payload.date &&
              [BOOKING_STATUSES.PENDING, BOOKING_STATUSES.APPROVED].includes(
                booking.status,
              ) &&
              hasOverlap(
                payload.startTime,
                payload.endTime,
                booking.startTime,
                booking.endTime,
              ),
          )

          if (conflictingBooking) {
            throw new Error('The selected time range overlaps with another booking.')
          }

          const booking = {
            id: `booking-${Date.now()}`,
            status: BOOKING_STATUSES.PENDING,
            rejectionReason: '',
            requestedById: currentUser.id,
            requestedByName: currentUser.name,
            ...payload,
          }

          database.bookings.unshift(booking)

          appendNotification(database, {
            title: 'Booking request submitted',
            message: `${currentUser.name} requested ${resource.name} for ${payload.date}.`,
            targetRoles: [ROLES.ADMIN],
          })

          appendNotification(database, {
            title: 'Booking request received',
            message: `${resource.name} has been submitted for review.`,
            targetUserIds: [currentUser.id],
          })

          return booking
        })
      },
    })
  },

  updateBookingStatus(bookingId, payload, currentUser) {
    return simulateRequest({
      method: 'patch',
      url: `/bookings/${bookingId}`,
      handler: () => {
        return mutateDatabase((database) => {
          const booking = database.bookings.find((item) => item.id === bookingId)

          if (!booking) {
            throw new Error('Booking not found.')
          }

          const isRequester = booking.requestedById === currentUser?.id
          const isAdmin = currentUser?.role === ROLES.ADMIN

          if (payload.status === BOOKING_STATUSES.CANCELLED && !isRequester) {
            throw new Error('Only the requester can cancel this booking.')
          }

          if (
            [BOOKING_STATUSES.APPROVED, BOOKING_STATUSES.REJECTED].includes(
              payload.status,
            ) &&
            !isAdmin
          ) {
            throw new Error('Only admins can approve or reject bookings.')
          }

          booking.status = payload.status
          booking.rejectionReason = payload.rejectionReason ?? booking.rejectionReason

          appendNotification(database, {
            title: 'Booking updated',
            message: `Booking for ${booking.date} is now ${booking.status}.`,
            targetUserIds: [booking.requestedById],
          })

          return booking
        })
      },
    })
  },
}
