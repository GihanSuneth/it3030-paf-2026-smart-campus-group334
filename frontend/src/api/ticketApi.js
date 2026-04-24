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

  createTicket(payload) {
    return simulateRequest({
      method: 'post',
      url: '/tickets',
      data: payload
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

  assignTechnician(ticketId, technicianId, techName) {
    return simulateRequest({
      method: 'post',
      url: `/tickets/${ticketId}/assign?techId=${technicianId}&techName=${techName}`
    })
  },

  updateTicketStatus(ticketId, status) {
    return simulateRequest({
      method: 'patch',
      url: `/tickets/${ticketId}/status?status=${status}`
    })
  },

  resolveTicket(ticketId, notes) {
    return simulateRequest({
      method: 'post',
      url: `/tickets/${ticketId}/resolve`,
      data: notes
    })
  }
}
