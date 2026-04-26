import { simulateRequest } from './axios'

export const notificationApi = {
  getNotifications(currentUser) {
    return simulateRequest({
      method: 'get',
      url: `/notifications?userId=${currentUser.id}`,
    })
  },

  markAsRead(notificationId, currentUser) {
    return simulateRequest({
      method: 'patch',
      url: `/notifications/${notificationId}?userId=${currentUser.id}`,
    })
  },

  markAllAsRead(currentUser) {
    return simulateRequest({
      method: 'patch',
      url: `/notifications/read-all?userId=${currentUser.id}`,
    })
  },
}
