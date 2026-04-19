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

      <section className="grid gap-4 md:grid-cols-3">
        <article className="info-band">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Inbox</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{notifications.length}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">A single place for bookings, ticket updates, and assignment activity.</p>
        </article>
        <article className="info-band">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Unread</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{unreadCount}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">Unread items should be easy to identify and clear in batches.</p>
        </article>
        <article className="info-band">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Status</p>
          <p className="mt-2 text-lg font-semibold tracking-tight text-slate-950">
            {unreadCount > 0 ? 'Needs review' : 'All caught up'}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">Use the header action to reduce clutter after reviewing recent activity.</p>
        </article>
      </section>

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
