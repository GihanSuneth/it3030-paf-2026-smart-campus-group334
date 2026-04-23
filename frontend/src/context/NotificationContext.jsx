/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { notificationApi } from '../api/notificationApi'
import { MOCK_DATA_EVENT } from '../constants/events'
import { useAuth } from './AuthContext'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const { currentUser } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [notificationsLoading, setNotificationsLoading] = useState(false)

  const refreshNotifications = useCallback(async () => {
    if (!currentUser) {
      setNotifications([])
      return
    }

    setNotificationsLoading(true)

    try {
      const nextNotifications = await notificationApi.getNotifications(currentUser)
      setNotifications(nextNotifications)
    } finally {
      setNotificationsLoading(false)
    }
  }, [currentUser])

  useEffect(() => {
    refreshNotifications()
  }, [refreshNotifications])

  useEffect(() => {
    const handler = () => {
      refreshNotifications()
    }

    window.addEventListener(MOCK_DATA_EVENT, handler)
    return () => window.removeEventListener(MOCK_DATA_EVENT, handler)
  }, [refreshNotifications])

  async function markAsRead(notificationId) {
    await notificationApi.markAsRead(notificationId, currentUser)
    await refreshNotifications()
  }

  async function markAllAsRead() {
    await notificationApi.markAllAsRead(currentUser)
    await refreshNotifications()
  }

  const unreadCount = (notifications || []).filter(
    (notification) => !(notification?.readBy || []).includes(currentUser?.id),
  ).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        notificationsLoading,
        unreadCount,
        recentNotifications: notifications.slice(0, 5),
        refreshNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)

  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider.')
  }

  return context
}
