import { ROLES } from '../constants/roles'
import { TICKET_STATUSES } from '../constants/statuses'
import {
  appendNotification,
  buildComment,
  mutateDatabase,
  readDatabase,
} from '../mock/database'
import { simulateRequest } from './axios'

export const ticketApi = {
  getMyTickets(userId) {
    return simulateRequest({
      method: 'get',
      url: '/tickets/me',
      handler: () => readDatabase().tickets.filter((ticket) => ticket.createdById === userId),
    })
  },

  getAssignedTickets(userId) {
    return simulateRequest({
      method: 'get',
      url: '/tickets/assigned',
      handler: () =>
        readDatabase().tickets.filter((ticket) => ticket.assignedTechnicianId === userId),
    })
  },

  getAllTickets() {
    return simulateRequest({
      method: 'get',
      url: '/tickets',
      handler: () => readDatabase().tickets,
    })
  },

  getTicketById(ticketId) {
    return simulateRequest({
      method: 'get',
      url: `/tickets/${ticketId}`,
      handler: () => {
        const ticket = readDatabase().tickets.find((item) => item.id === ticketId)

        if (!ticket) {
          throw new Error('Ticket not found.')
        }

        return ticket
      },
    })
  },

  createTicket(payload, currentUser) {
    return simulateRequest({
      method: 'post',
      url: '/tickets',
      handler: () => {
        if (currentUser?.role !== ROLES.USER) {
          throw new Error('Only users can create tickets.')
        }

        return mutateDatabase((database) => {
          const resource = database.resources.find((item) => item.id === payload.resourceId)

          const ticket = {
            id: `ticket-${Date.now()}`,
            resourceName: resource?.name ?? payload.location,
            createdById: currentUser.id,
            createdByName: currentUser.name,
            assignedTechnicianId: '',
            assignedTechnicianName: '',
            status: TICKET_STATUSES.OPEN,
            comments: [],
            resolutionNotes: '',
            worklog: [],
            ...payload,
          }

          database.tickets.unshift(ticket)

          appendNotification(database, {
            title: 'New ticket created',
            message: `${ticket.title} has been submitted for support review.`,
            targetRoles: [ROLES.ADMIN],
          })

          appendNotification(database, {
            title: 'Ticket submitted',
            message: `Your ticket "${ticket.title}" is now open.`,
            targetUserIds: [currentUser.id],
          })

          return ticket
        })
      },
    })
  },

  addComment(ticketId, message, currentUser) {
    return simulateRequest({
      method: 'post',
      url: `/tickets/${ticketId}/comments`,
      handler: () =>
        mutateDatabase((database) => {
          const ticket = database.tickets.find((item) => item.id === ticketId)

          if (!ticket) {
            throw new Error('Ticket not found.')
          }

          ticket.comments.push(buildComment(currentUser, message))

          appendNotification(database, {
            title: 'New ticket comment',
            message: `${currentUser.name} commented on "${ticket.title}".`,
            targetUserIds: [ticket.createdById, ticket.assignedTechnicianId].filter(Boolean),
            targetRoles: [ROLES.ADMIN],
          })

          return ticket
        }),
    })
  },

  assignTechnician(ticketId, technicianId, currentUser) {
    return simulateRequest({
      method: 'patch',
      url: `/tickets/${ticketId}/assign`,
      handler: () => {
        if (currentUser?.role !== ROLES.ADMIN) {
          throw new Error('Only admins can assign technicians.')
        }

        return mutateDatabase((database) => {
          const ticket = database.tickets.find((item) => item.id === ticketId)
          const technician = database.users.find((user) => user.id === technicianId)

          if (!ticket || !technician) {
            throw new Error('Unable to assign technician.')
          }

          ticket.assignedTechnicianId = technician.id
          ticket.assignedTechnicianName = technician.name
          ticket.status =
            ticket.status === TICKET_STATUSES.OPEN
              ? TICKET_STATUSES.IN_PROGRESS
              : ticket.status

          appendNotification(database, {
            title: 'Technician assigned',
            message: `${technician.name} was assigned to "${ticket.title}".`,
            targetUserIds: [technician.id, ticket.createdById],
            targetRoles: [ROLES.ADMIN],
          })

          return ticket
        })
      },
    })
  },

  updateTicketStatus(ticketId, payload, currentUser) {
    return simulateRequest({
      method: 'patch',
      url: `/tickets/${ticketId}/status`,
      handler: () =>
        mutateDatabase((database) => {
          const ticket = database.tickets.find((item) => item.id === ticketId)

          if (!ticket) {
            throw new Error('Ticket not found.')
          }

          const isAdmin = currentUser?.role === ROLES.ADMIN
          const isAssignedTechnician = ticket.assignedTechnicianId === currentUser?.id

          if (!isAdmin && !isAssignedTechnician) {
            throw new Error('You are not allowed to update this ticket.')
          }

          ticket.status = payload.status

          if (payload.note) {
            ticket.worklog.unshift({
              id: `worklog-${Date.now()}`,
              authorId: currentUser.id,
              authorName: currentUser.name,
              note: payload.note,
              createdAt: new Date().toISOString(),
            })
          }

          appendNotification(database, {
            title: 'Ticket status updated',
            message: `"${ticket.title}" moved to ${ticket.status}.`,
            targetUserIds: [ticket.createdById, ticket.assignedTechnicianId].filter(Boolean),
            targetRoles: [ROLES.ADMIN],
          })

          return ticket
        }),
    })
  },

  addResolutionNotes(ticketId, note, currentUser) {
    return simulateRequest({
      method: 'patch',
      url: `/tickets/${ticketId}/resolution`,
      handler: () =>
        mutateDatabase((database) => {
          const ticket = database.tickets.find((item) => item.id === ticketId)

          if (!ticket) {
            throw new Error('Ticket not found.')
          }

          const isAdmin = currentUser?.role === ROLES.ADMIN
          const isAssignedTechnician = ticket.assignedTechnicianId === currentUser?.id

          if (!isAdmin && !isAssignedTechnician) {
            throw new Error('You are not allowed to update resolution notes.')
          }

          ticket.resolutionNotes = note

          appendNotification(database, {
            title: 'Resolution notes added',
            message: `Resolution notes were updated for "${ticket.title}".`,
            targetUserIds: [ticket.createdById, ticket.assignedTechnicianId].filter(Boolean),
            targetRoles: [ROLES.ADMIN],
          })

          return ticket
        }),
    })
  },
}
