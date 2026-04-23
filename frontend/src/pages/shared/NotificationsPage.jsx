import { EmptyState } from '../../components/common/EmptyState'
import { PageHeader } from '../../components/common/PageHeader'
import { PageContainer } from '../../components/layout/PageContainer'
import { NotificationList } from '../../components/notifications/NotificationList'
import { useNotifications } from '../../hooks/useNotifications'

import { StatCard } from '../../components/common/StatCard'

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

      <section className="grid gap-4 md:grid-cols-2 mb-8">
        <StatCard 
          label="Total Inbox" 
          value={(notifications || []).length} 
          hint="Total volume of activity logged in your profile."
        />
        <StatCard 
          label="Unread" 
          value={unreadCount || 0} 
          hint="Items awaiting your attention or first review."
        />
      </section>

      <div className="pt-4 border-t border-slate-100">
        {(notifications || []).length > 0 ? (
          <NotificationList notifications={notifications} onRead={markAsRead} />
        ) : (
          <EmptyState
            title="No notifications"
            message="You are all caught up. New updates will appear here."
          />
        )}
      </div>
    </PageContainer>
  )
}
