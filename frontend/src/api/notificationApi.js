import { matchesNotificationUser, mutateDatabase, readDatabase } from '../mock/database'
import { simulateRequest } from './axios'

export const notificationApi = {
  getNotifications(currentUser) {
    return simulateRequest({
      method: 'get',
      url: '/notifications',
      handler: () =>
        readDatabase().notifications
          .filter((notification) => matchesNotificationUser(notification, currentUser))
          .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt)),
    })
  },

  markAsRead(notificationId, currentUser) {
    return simulateRequest({
      method: 'patch',
      url: `/notifications/${notificationId}`,
      handler: () =>
        mutateDatabase((database) => {
          const notification = database.notifications.find((item) => item.id === notificationId)

          if (!notification) {
            throw new Error('Notification not found.')
          }

          if (!notification.readBy.includes(currentUser.id)) {
            notification.readBy.push(currentUser.id)
          }

          return notification
        }),
    })
  },

  markAllAsRead(currentUser) {
    return simulateRequest({
      method: 'patch',
      url: '/notifications/read-all',
      handler: () =>
        mutateDatabase((database) => {
          database.notifications.forEach((notification) => {
            if (
              matchesNotificationUser(notification, currentUser) &&
              !notification.readBy.includes(currentUser.id)
            ) {
              notification.readBy.push(currentUser.id)
            }
          })

          return true
        }),
    })
  },
}
