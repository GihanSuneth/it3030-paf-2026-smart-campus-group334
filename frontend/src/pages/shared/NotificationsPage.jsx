import { EmptyState } from '../../components/common/EmptyState'
import { PageHeader } from '../../components/common/PageHeader'
import { PageContainer } from '../../components/layout/PageContainer'
import { NotificationList } from '../../components/notifications/NotificationList'
import { useNotifications } from '../../hooks/useNotifications'

export function NotificationsPage() {
  const { notifications, markAllAsRead, markAsRead, unreadCount } = useNotifications()

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Alerts"
        title="Notifications"
        description="Keep track of approvals, ticket updates, assignments, and comments."
        actions={
          unreadCount > 0 ? (
            <button className="btn-ghost" type="button" onClick={markAllAsRead}>
              Mark All Read
            </button>
          ) : null
        }
      />

      {notifications.length > 0 ? (
        <NotificationList notifications={notifications} onRead={markAsRead} />
      ) : (
        <EmptyState
          title="No notifications"
          message="You are all caught up. New updates will appear here."
        />
      )}
    </PageContainer>
  )
}
