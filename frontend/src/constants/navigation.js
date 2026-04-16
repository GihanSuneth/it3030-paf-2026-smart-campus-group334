import { ROLES } from './roles'

export const sidebarNavigation = {
  [ROLES.USER]: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Resources', path: '/resources' },
    { label: 'New Booking', path: '/bookings/new' },
    { label: 'My Bookings', path: '/my-bookings' },
    { label: 'New Ticket', path: '/tickets/new' },
    { label: 'My Tickets', path: '/my-tickets' },
    { label: 'Notifications', path: '/notifications' },
    { label: 'Profile', path: '/profile' },
  ],
  [ROLES.ADMIN]: [
    { label: 'Admin Dashboard', path: '/admin' },
    { label: 'Manage Resources', path: '/admin/resources' },
    { label: 'Pending Bookings', path: '/admin/bookings/pending' },
    { label: 'All Bookings', path: '/admin/bookings' },
    { label: 'Manage Tickets', path: '/admin/tickets' },
    { label: 'Assign Technician', path: '/admin/tickets/assign' },
    { label: 'Users & Roles', path: '/admin/users' },
    { label: 'Notifications', path: '/notifications' },
    { label: 'Profile', path: '/profile' },
  ],
  [ROLES.TECHNICIAN]: [
    { label: 'Technician Dashboard', path: '/technician' },
    { label: 'Assigned Tickets', path: '/technician/tickets' },
    { label: 'Notifications', path: '/notifications' },
    { label: 'Profile', path: '/profile' },
  ],
}

export const pageTitles = [
  { match: '/admin/resources', title: 'Manage Resources' },
  { match: '/admin/bookings/pending', title: 'Pending Bookings' },
  { match: '/admin/bookings', title: 'All Bookings' },
  { match: '/admin/tickets/assign', title: 'Assign Technician' },
  { match: '/admin/tickets', title: 'Manage Tickets' },
  { match: '/admin/users', title: 'Users & Roles' },
  { match: '/admin', title: 'Admin Dashboard' },
  { match: '/technician/tickets/', title: 'Technician Ticket Update' },
  { match: '/technician/tickets', title: 'Assigned Tickets' },
  { match: '/technician', title: 'Technician Dashboard' },
  { match: '/bookings/new', title: 'Create Booking' },
  { match: '/my-bookings', title: 'My Bookings' },
  { match: '/tickets/new', title: 'Create Ticket' },
  { match: '/my-tickets', title: 'My Tickets' },
  { match: '/tickets/', title: 'Ticket Details' },
  { match: '/resources/', title: 'Resource Details' },
  { match: '/resources', title: 'Resources' },
  { match: '/notifications', title: 'Notifications' },
  { match: '/profile', title: 'Profile' },
  { match: '/dashboard', title: 'Dashboard' },
]
