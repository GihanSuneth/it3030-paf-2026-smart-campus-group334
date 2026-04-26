import { simulateRequest } from './axios'

export const ticketApi = {
  getMyTickets(userId) {
    return simulateRequest({
      method: 'get',
      url: `/tickets/user/${userId}`
    })
  },

  getAssignedTickets(userId) {
    return simulateRequest({
      method: 'get',
      url: `/tickets/technician/${userId}`
    })
  },

  getAllTickets() {
    return simulateRequest({
      method: 'get',
      url: '/tickets'
    })
  },

  getTicketById(ticketId) {
    return simulateRequest({
      method: 'get',
      url: `/tickets/${ticketId}`
    })
  },

  createTicket(payload, currentUser) {
    return simulateRequest({
      method: 'post',
      url: '/tickets',
      data: {
        ...payload,
        userId: currentUser.id,
        userName: currentUser.name,
      }
    })
  },

  addComment(ticketId, message, currentUser) {
    return simulateRequest({
      method: 'post',
      url: `/tickets/${ticketId}/comments`,
      data: {
        userId: currentUser.id,
        userName: currentUser.name,
        message
      }
    })
  },

  assignTechnician(ticketId, technicianId, technicianName) {
    return simulateRequest({
      method: 'post',
      url: `/tickets/${ticketId}/assign`,
      data: {
        technicianId,
        technicianName,
      }
    })
  },

  updateTicketStatus(ticketId, payload, currentUser) {
    return simulateRequest({
      method: 'patch',
      url: `/tickets/${ticketId}/status`,
      data: {
        ...payload,
        actorId: currentUser?.id,
        actorName: currentUser?.name,
      }
    })
  },

  resolveTicket(ticketId, payload, currentUser) {
    return simulateRequest({
      method: 'post',
      url: `/tickets/${ticketId}/resolve`,
      data: {
        ...payload,
        actorId: currentUser?.id,
        actorName: currentUser?.name,
      }
    })
  },

  addResolutionNotes(ticketId, payload, currentUser) {
    return this.resolveTicket(ticketId, payload, currentUser)
  },

  acceptResolution(ticketId, currentUser) {
    return simulateRequest({
      method: 'post',
      url: `/tickets/${ticketId}/accept`,
      data: {
        actorId: currentUser.id,
        actorName: currentUser.name,
      }
    })
  },

  submitRating(ticketId, payload) {
    return simulateRequest({
      method: 'post',
      url: `/tickets/${ticketId}/rate`,
      data: payload
    })
  },

  generateRatingToken(ticketId, currentUser) {
    return simulateRequest({
      method: 'post',
      url: `/tickets/${ticketId}/rating-token`,
      data: {
        actorId: currentUser.id,
        actorName: currentUser.name,
      }
    })
  },
}
