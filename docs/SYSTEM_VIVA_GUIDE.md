# Smart Campus / Nexora Workspace Viva Guide

This document explains the system end to end:
- component by component
- page by page
- frontend to backend flow
- button click to API call to controller to service to database logic
- booking flow, ticket flow, notifications, PDF generation, and QR generation

It is written for viva preparation.

## 1. System Overview

The project is a full-stack Smart Campus resource management platform with:
- `frontend`: React + Vite
- `backend`: Spring Boot + MongoDB

Core modules:
- Authentication and role-based access
- Resource management
- Booking management
- Ticket management
- Notifications
- Admin dashboard analytics
- PDF exports
- QR-based technician rating handoff

Primary roles:
- `USER`
- `ADMIN`
- `TECHNICIAN`

## 2. High-Level Architecture

### Frontend stack
- React pages render the UI
- `react-router-dom` handles routing
- `AuthContext` stores logged-in user state
- API files under `frontend/src/api` send HTTP requests
- `simulateRequest()` in [frontend/src/api/axios.js](/Users/arun/Documents/PAF/Project/it3030-paf-2026-smart-campus-group334/frontend/src/api/axios.js) wraps Axios and returns `response.data.data`

### Backend stack
- Controllers receive HTTP requests
- Services contain business logic
- Repositories talk to MongoDB
- Models define stored data
- `ApiResponse.success(...)` wraps backend responses

### Communication pattern
Typical flow:
1. User clicks button on React page/component
2. React handler calls API helper from `frontend/src/api/*.js`
3. API helper sends request to `/api/...`
4. Spring controller receives request
5. Controller forwards to service
6. Service validates and updates data using repository
7. Controller returns `ApiResponse`
8. Frontend gets `response.data.data`
9. Page re-renders using new data

## 3. Frontend Shell and Routing

Main route file:
- [frontend/src/routes/AppRoutes.jsx](/Users/arun/Documents/PAF/Project/it3030-paf-2026-smart-campus-group334/frontend/src/routes/AppRoutes.jsx)

Important routes:
- `/login` -> `LoginPage`
- `/dashboard` -> shared dashboard
- `/resources` -> user/admin resource list
- `/resources/:id` -> resource details
- `/bookings/new` -> create booking
- `/my-bookings` -> user bookings
- `/tickets/new` -> create ticket
- `/my-tickets` -> user ticket tracking
- `/tickets/:id` -> ticket details for user/admin/technician
- `/ticket-rating/:id` -> direct QR rating page
- `/admin` -> admin dashboard
- `/admin/resources` -> resource management
- `/admin/bookings` -> all bookings
- `/admin/bookings/pending` -> pending booking approvals
- `/admin/tickets` -> ticket handling
- `/admin/tickets/assign` -> technician assignment
- `/admin/users` -> user + technician management
- `/technician` -> technician dashboard
- `/technician/tickets` -> assigned tickets
- `/technician/tickets/:id` -> technician resolution page

Route protection:
- `ProtectedRoute` blocks unauthenticated users
- `RoleRoute` restricts pages by role

## 4. Authentication Flow

Main frontend auth state:
- [frontend/src/context/AuthContext.jsx](/Users/arun/Documents/PAF/Project/it3030-paf-2026-smart-campus-group334/frontend/src/context/AuthContext.jsx)

What it does:
- reads current user from `localStorage`
- exposes `login`, `oauthLogin`, and `logout`
- updates React auth state after successful login

Frontend auth API:
- [frontend/src/api/authApi.js](/Users/arun/Documents/PAF/Project/it3030-paf-2026-smart-campus-group334/frontend/src/api/authApi.js)

Backend auth controller:
- [backend/src/main/java/com/smartcampus/backend/auth/controller/AuthController.java](/Users/arun/Documents/PAF/Project/it3030-paf-2026-smart-campus-group334/backend/src/main/java/com/smartcampus/backend/auth/controller/AuthController.java)

Backend auth service:
- [backend/src/main/java/com/smartcampus/backend/auth/service/AuthService.java](/Users/arun/Documents/PAF/Project/it3030-paf-2026-smart-campus-group334/backend/src/main/java/com/smartcampus/backend/auth/service/AuthService.java)

### Login button flow
Source page:
- `LoginPage.jsx`

Flow:
1. User enters email/password
2. Page calls `useAuth().login(credentials)`
3. `AuthContext.login()` calls `authApi.login()`
4. `authApi.login()` posts to `/api/auth/login`
5. `AuthController.login()` calls `AuthService.login()`
6. Backend validates credentials and returns token + user
7. Frontend stores token in `localStorage`
8. Frontend stores `currentUser` in `localStorage`
9. App redirects based on role

### Continue with Google flow
Current design:
- client-side Google sign-in
- backend validates the Google token through OAuth endpoint

Flow:
1. User clicks Google button
2. Frontend gets Google access token
3. `authApi.oauthLogin(provider, role, accessToken)` sends request to `/api/auth/oauth`
4. `AuthController.oauthLogin()` -> `AuthService.oauthLogin()`
5. Backend verifies token and returns app user/token
6. Frontend stores token + current user

## 5. API Client and Request Handling

Core frontend HTTP file:
- [frontend/src/api/axios.js](/Users/arun/Documents/PAF/Project/it3030-paf-2026-smart-campus-group334/frontend/src/api/axios.js)

Important behavior:
- base URL from `VITE_API_BASE_URL`
- JWT token added from `localStorage`
- timeout handling
- common backend error handling

Important helper:
- `simulateRequest({ method, url, data })`

In current system this is not fake; if no custom handler is passed, it uses real Axios and returns:
- `res.data.data`

That is why frontend code directly receives the inner payload.

## 6. Resource Module

Frontend files:
- [frontend/src/api/resourceApi.js](/Users/arun/Documents/PAF/Project/it3030-paf-2026-smart-campus-group334/frontend/src/api/resourceApi.js)
- `ResourcesPage.jsx`
- `ResourceDetailsPage.jsx`
- `ManageResourcesPage.jsx`
- `ResourceCard.jsx`
- `ResourceFilterBar.jsx`

Backend files:
- [backend/src/main/java/com/smartcampus/backend/resources/controller/ResourceController.java](/Users/arun/Documents/PAF/Project/it3030-paf-2026-smart-campus-group334/backend/src/main/java/com/smartcampus/backend/resources/controller/ResourceController.java)
- `ResourceService.java`
- `ResourceRepository.java`
- [backend/src/main/java/com/smartcampus/backend/resources/model/Resource.java](/Users/arun/Documents/PAF/Project/it3030-paf-2026-smart-campus-group334/backend/src/main/java/com/smartcampus/backend/resources/model/Resource.java)

### Resource model purpose
The `Resource` document stores:
- basic info: name, code, type, category, location
- operational info: status, available, assignedTo
- capacity
- equipment counts: PCs, smart boards, projectors, screens, audio systems

### Resource details page purpose
This page shows:
- resource information
- live occupied slots from booking data
- usage details for lab/equipment/space

## 7. Booking Module

Frontend files:
- [frontend/src/api/bookingApi.js](/Users/arun/Documents/PAF/Project/it3030-paf-2026-smart-campus-group334/frontend/src/api/bookingApi.js)
- `CreateBookingPage.jsx`
- `BookingForm.jsx`
- `MyBookingsPage.jsx`
- `PendingBookingsPage.jsx`
- `AllBookingsPage.jsx`
- `BookingCard.jsx`
- `BookingStatusBadge.jsx`

Backend files:
- [backend/src/main/java/com/smartcampus/backend/bookings/controller/BookingController.java](/Users/arun/Documents/PAF/Project/it3030-paf-2026-smart-campus-group334/backend/src/main/java/com/smartcampus/backend/bookings/controller/BookingController.java)
- `BookingService.java`
- `BookingRepository.java`
- `Booking.java`
- availability and occupied-slot DTOs

### Booking form flow
Source:
- `CreateBookingPage` uses `BookingForm`

User fills:
- booking type
- resource
- date
- start time
- end time
- purpose
- expected attendees

### Check Availability button flow
1. User clicks `Check Availability`
2. `BookingForm` validates required fields
3. `onCheckAvailability()` calls `bookingApi.checkAvailability(payload, currentUser)`
4. API posts to `/api/bookings/availability`
5. `BookingController.checkAvailability()` calls `BookingService.checkAvailability()`
6. Service checks:
   - valid date/time
   - not past date
   - conflict against `PENDING` and `APPROVED` bookings
   - capacity limits
7. Service returns:
   - `available`
   - message
   - conflict details
   - alternative resources
   - occupied slots
8. Frontend shows success/conflict popup and inline suggestions

### Submit Booking button flow
1. User clicks `Submit Booking`
2. `BookingForm` ensures availability check already passed
3. `bookingApi.createBooking()` posts to `/api/bookings`
4. `BookingController.createBooking()` -> `BookingService.createBooking()`
5. Service:
   - generates booking code like `BK1001`
   - stores booking as `PENDING`
   - creates admin notifications
6. Booking appears in:
   - user `My Bookings`
   - admin pending bookings page

### Admin booking approval flow
1. Admin opens pending bookings page
2. Admin clicks approve/reject
3. Frontend calls `bookingApi.updateBookingStatus()`
4. API maps action to:
   - `/approve`
   - `/reject`
   - `/cancel`
5. Backend updates status
6. User receives notification

### Booking PDF export
Files:
- `MyBookingsPage.jsx`
- [frontend/src/utils/bookingPdf.js](/Users/arun/Documents/PAF/Project/it3030-paf-2026-smart-campus-group334/frontend/src/utils/bookingPdf.js)

Flow:
1. User opens `My Bookings`
2. User clicks `Download PDF`
3. `downloadBookingPdf(booking, resourceName)` runs in browser
4. Utility manually builds PDF text commands
5. Blob is created and downloaded

Included booking PDF content:
- booking ID
- resource details
- booking date/time
- purpose
- expected attendees
- status
- review comment

## 8. Ticket Module

Frontend files:
- [frontend/src/api/ticketApi.js](/Users/arun/Documents/PAF/Project/it3030-paf-2026-smart-campus-group334/frontend/src/api/ticketApi.js)
- `CreateTicketPage.jsx`
- `MyTicketsPage.jsx`
- `TicketDetailsPage.jsx`
- `AssignedTicketsPage.jsx`
- `ResolutionNotesPage.jsx`
- `TicketCard.jsx`
- `TicketForm.jsx`
- `ResolutionNotesForm.jsx`
- `TechnicianAssignmentPanel.jsx`

Backend files:
- [backend/src/main/java/com/smartcampus/backend/tickets/controller/TicketController.java](/Users/arun/Documents/PAF/Project/it3030-paf-2026-smart-campus-group334/backend/src/main/java/com/smartcampus/backend/tickets/controller/TicketController.java)
- [backend/src/main/java/com/smartcampus/backend/tickets/service/TicketService.java](/Users/arun/Documents/PAF/Project/it3030-paf-2026-smart-campus-group334/backend/src/main/java/com/smartcampus/backend/tickets/service/TicketService.java)
- `TicketRepository.java`
- [backend/src/main/java/com/smartcampus/backend/tickets/model/Ticket.java](/Users/arun/Documents/PAF/Project/it3030-paf-2026-smart-campus-group334/backend/src/main/java/com/smartcampus/backend/tickets/model/Ticket.java)

### Ticket data stored
Ticket model contains:
- ticket ID / code like `TK1001`
- resource id + resource name
- title + description
- category: `EQUIPMENT`, `ACCESS`, `FACILITY`
- status
- user details
- contact email + contact phone
- technician assignment
- timestamps
- attachments
- resolution notes
- rejection reason
- rating token
- rating and feedback
- worklog

### Create ticket button flow
Source:
- `CreateTicketPage` -> `TicketForm`

User fills:
- resource
- category
- issue summary
- location
- contact email
- cell number
- brief description
- urgency
- photo attachment

Flow:
1. User clicks `Submit Ticket`
2. `TicketForm.handleSubmit()` calls `onSubmit(formState)`
3. `CreateTicketPage` passes to `ticketApi.createTicket(payload, currentUser)`
4. API posts to `/api/tickets`
5. `TicketController.createTicket()` -> `TicketService.createTicket()`
6. Service:
   - validates fields
   - generates `TK...`
   - stores `CREATED`
   - creates worklog entry
   - sends notification to all admins
   - sends submission notification to user

### My Tickets tracking
Source:
- `MyTicketsPage.jsx`

Filters shown:
- all
- open
- technician assigned
- rejected
- resolved/closed

This page sorts by latest update so the newest activity appears first.

### Admin ticket handling flow
Source:
- `ManageTicketsPage.jsx`

Capabilities:
- see all tickets
- filter by priority
- search by ticket ID
- open ticket details
- assign technician
- reject with note
- mark under review

### Assign technician button flow
1. Admin opens ticket details or ticket handling
2. Admin selects technician
3. Frontend calls `ticketApi.assignTechnician(ticketId, technicianId, technicianName)`
4. POST `/api/tickets/{id}/assign`
5. `TicketController.assignTechnician()` -> `TicketService.assignTechnician()`
6. Service:
   - stores technician id/name
   - status becomes `TECHNICIAN_ASSIGNED`
   - adds worklog
   - notifies technician
   - notifies user
   - notifies admins

### Reject ticket with note flow
1. Admin writes reject note
2. Admin clicks `Reject Ticket With Note`
3. Frontend calls `ticketApi.updateTicketStatus(id, { status: 'REJECTED', note }, currentUser)`
4. PATCH `/api/tickets/{id}/status`
5. Service validates note is required
6. Ticket gets `rejectionReason`
7. User receives rejection notification
8. Ticket appears in user rejected view

### Technician assigned tickets page
Source:
- `AssignedTicketsPage.jsx`

Purpose:
- show tickets assigned to current technician only
- allow filtering by active, resolved, closed

Each ticket card now shows:
- ticket title
- status
- location
- problem description
- created time
- rating if any

### Technician resolution flow
Source:
- `ResolutionNotesPage.jsx`
- `ResolutionNotesForm.jsx`

Technician fills:
- resolution reason
- configuration done
- other suggestions

Then clicks:
- `Save Resolution`

Flow:
1. `ResolutionNotesForm` submits payload
2. `ticketApi.addResolutionNotes(ticketId, payload, currentUser)`
3. POST `/api/tickets/{id}/resolve`
4. `TicketController.resolveTicket()` -> `TicketService.resolveTicket()`
5. Service:
   - stores resolution fields
   - sets status `RESOLVED`
   - stores resolved timestamp
   - adds worklog
   - notifies user
   - notifies admins

### User accepts resolution flow
Source:
- `TicketDetailsPage.jsx`

Button:
- `Accept Resolution And Close Ticket`

Flow:
1. User clicks button
2. Frontend calls `ticketApi.acceptResolution(id, currentUser)`
3. POST `/api/tickets/{id}/accept`
4. `TicketService.acceptResolution()`:
   - marks accepted by user
   - sets status `CLOSED`
   - stores accepted/closed timestamps
   - notifies technician
   - notifies admins
   - notifies user

## 9. Notifications Module

Frontend files:
- `notificationApi.js`
- `NotificationBell.jsx`
- `NotificationList.jsx`
- `NotificationsPage.jsx`
- `useNotifications` hook

Backend files:
- [backend/src/main/java/com/smartcampus/backend/notifications/controller/NotificationController.java](/Users/arun/Documents/PAF/Project/it3030-paf-2026-smart-campus-group334/backend/src/main/java/com/smartcampus/backend/notifications/controller/NotificationController.java)
- `NotificationService.java`
- `NotificationRepository.java`
- `Notification.java`

### Notification fetch flow
1. Notifications page or bell loads
2. Frontend calls `notificationApi.getNotifications(currentUser)`
3. GET `/api/notifications?userId=...`
4. Backend returns user-specific notifications

### Mark as read flow
1. User opens or marks notification
2. Frontend calls `notificationApi.markAsRead(notificationId, currentUser)`
3. PATCH `/api/notifications/{id}?userId=...`
4. Backend adds user to `readBy`

## 10. QR Generator and Rating Flow

Frontend:
- `ResolutionNotesPage.jsx`
- `TicketDetailsPage.jsx`
- `TicketRatingPage.jsx`
- dependency in `frontend/package.json`: `qrcode.react`

Backend:
- `TicketController` endpoints:
  - `POST /api/tickets/{id}/rating-token`
  - `POST /api/tickets/{id}/rate`
- `TicketService.generateRatingToken()`
- `TicketService.submitRating()`

### Actual implemented design
There is now a real QR image rendered on the frontend using `qrcode.react`.

The QR contains:
- a real rating URL:
  - `/ticket-rating/:id?token=...`

The token is also shown as plain text on the ticket page for manual entry fallback.

### Generate QR button flow
Source:
- technician `ResolutionNotesPage`

Flow:
1. Technician opens resolved/closed ticket
2. Technician clicks `Generate QR Token`
3. Frontend calls `ticketApi.generateRatingToken(id, currentUser)`
4. POST `/api/tickets/{id}/rating-token`
5. Backend generates short token
6. Backend stores token on ticket
7. User gets notification that rating token is ready
8. Technician page re-renders and shows:
   - QR image
   - token ID
   - rating if already submitted

### QR scan flow
1. User scans QR
2. QR opens `/ticket-rating/:id?token=...`
3. `TicketRatingPage.jsx` reads token from URL
4. User submits rating and feedback
5. `ticketApi.submitRating()` posts to `/api/tickets/{id}/rate`
6. Backend validates token and rating range
7. Backend stores rating
8. Technician gets notification
9. Rating is visible on technician ticket card / ticket detail

### Manual token entry flow
Also supported in `TicketDetailsPage.jsx`:
1. User opens the same ticket
2. User sees generated token in the rating section
3. User enters token manually
4. User gives star rating + suggestions
5. Same `/rate` endpoint is used

## 11. Admin Dashboard

Main file:
- [frontend/src/pages/admin/AdminDashboardPage.jsx](/Users/arun/Documents/PAF/Project/it3030-paf-2026-smart-campus-group334/frontend/src/pages/admin/AdminDashboardPage.jsx)

Data sources:
- `resourceApi.getResources()`
- `bookingApi.getAllBookings()`
- `ticketApi.getAllTickets()`

What it shows:
- service throughput
- booking backlog
- triage queue
- resource status
- command action tiles
- resource & equipment usage overview
- operational pulse
- summary highlights

### Resource/equipment overview logic
This section computes:
- total tracked spaces
- currently booked spaces
- free spaces
- total equipment
- working equipment
- assigned equipment
- maintenance risk
- resource type mix

Visualization style:
- ring summaries for spaces/equipment
- usage bars for type mix and equipment health

## 12. PDF Generators

### Booking PDF
File:
- `frontend/src/utils/bookingPdf.js`

Used by:
- `MyBookingsPage.jsx`

Purpose:
- downloadable booking confirmation/reference PDF

### Resource usage PDF
File:
- [frontend/src/utils/resourceUsagePdf.js](/Users/arun/Documents/PAF/Project/it3030-paf-2026-smart-campus-group334/frontend/src/utils/resourceUsagePdf.js)

Used by:
- admin dashboard `Download Usage PDF` button

Flow:
1. Admin clicks `Download Usage PDF`
2. Dashboard computes summary object
3. `downloadResourceUsagePdf(summary)` builds PDF manually
4. Browser downloads `resource-usage-summary.pdf`

Included in the resource usage PDF:
- space usage summary
- equipment usage summary
- resource type mix
- equipment health bars
- generated timestamp

## 13. Important Button-by-Button Examples

### A. Login button
- Frontend page: `LoginPage`
- Frontend function: `useAuth().login()`
- API: `authApi.login()`
- Backend endpoint: `POST /api/auth/login`
- Backend service: `AuthService.login()`

### B. Continue with Google
- Frontend page: `LoginPage`
- API: `authApi.oauthLogin()`
- Backend endpoint: `POST /api/auth/oauth`
- Service: `AuthService.oauthLogin()`

### C. Check Availability
- Frontend page: `CreateBookingPage` / `BookingForm`
- API: `bookingApi.checkAvailability()`
- Endpoint: `POST /api/bookings/availability`
- Service: `BookingService.checkAvailability()`

### D. Submit Booking
- Frontend page: `CreateBookingPage`
- API: `bookingApi.createBooking()`
- Endpoint: `POST /api/bookings`
- Service: `BookingService.createBooking()`

### E. Submit Ticket
- Frontend page: `CreateTicketPage`
- API: `ticketApi.createTicket()`
- Endpoint: `POST /api/tickets`
- Service: `TicketService.createTicket()`

### F. Assign Technician
- Frontend page: admin ticket handling / ticket details
- API: `ticketApi.assignTechnician()`
- Endpoint: `POST /api/tickets/{id}/assign`
- Service: `TicketService.assignTechnician()`

### G. Reject Ticket With Note
- Frontend page: `TicketDetailsPage` as admin
- API: `ticketApi.updateTicketStatus()`
- Endpoint: `PATCH /api/tickets/{id}/status`
- Service: `TicketService.updateStatus()`

### H. Save Resolution
- Frontend page: `ResolutionNotesPage`
- API: `ticketApi.addResolutionNotes()`
- Endpoint: `POST /api/tickets/{id}/resolve`
- Service: `TicketService.resolveTicket()`

### I. Accept Resolution
- Frontend page: `TicketDetailsPage`
- API: `ticketApi.acceptResolution()`
- Endpoint: `POST /api/tickets/{id}/accept`
- Service: `TicketService.acceptResolution()`

### J. Generate QR Token
- Frontend page: `ResolutionNotesPage`
- API: `ticketApi.generateRatingToken()`
- Endpoint: `POST /api/tickets/{id}/rating-token`
- Service: `TicketService.generateRatingToken()`

### K. Submit Rating
- Frontend page: `TicketRatingPage` or `TicketDetailsPage`
- API: `ticketApi.submitRating()`
- Endpoint: `POST /api/tickets/{id}/rate`
- Service: `TicketService.submitRating()`

### L. Download Booking PDF
- Frontend page: `MyBookingsPage`
- Utility: `downloadBookingPdf()`
- No backend call
- Browser-generated PDF

### M. Download Usage PDF
- Frontend page: admin dashboard
- Utility: `downloadResourceUsagePdf()`
- No backend call
- Browser-generated PDF

## 14. Database Layer Summary

MongoDB collections used:
- `users`
- `resources`
- `bookings`
- `tickets`
- `notifications`

Repository responsibilities:
- `UserRepository`: fetch by email/role/approval status
- `ResourceRepository`: CRUD for resources
- `BookingRepository`: booking lookup, pending list, occupied slot logic
- `TicketRepository`: user tickets, technician tickets, sorted lists
- `NotificationRepository`: notification inbox and read state

## 15. Common Viva Questions and Direct Answers

### How does frontend talk to backend?
Through API helper files in `frontend/src/api`. They call Axios through `simulateRequest()` in `axios.js`, which sends requests to Spring Boot endpoints under `/api/...`.

### How is authentication stored?
JWT token is stored in `localStorage` as `token`, and user profile is stored as `currentUser`. Axios automatically attaches the token on every request.

### How is role-based access controlled?
Frontend uses `ProtectedRoute` and `RoleRoute`. Backend also uses user roles in service logic and seeded accounts.

### How are notifications triggered?
Business actions in backend services call `NotificationService.createNotification(...)`.

### Is the QR generator real?
Yes. The frontend now uses `qrcode.react` to render an actual QR code for the technician rating flow.

### Are PDFs generated on backend or frontend?
Currently frontend-side. The app manually builds PDF content in browser utilities and downloads via Blob.

### How is ticket assignment limited to technicians?
Admin selects technician from user list filtered by role `TECHNICIAN`, then the backend stores technician id/name on the ticket.

### How are booking conflicts checked?
Backend compares requested slot against existing `PENDING` and `APPROVED` bookings and returns occupied slots plus alternatives.

## 16. Suggested Viva Explanation Pattern

If asked to explain the whole system, use this order:
1. Start with roles and modules
2. Explain routing and page access
3. Explain frontend API layer
4. Explain backend controller/service/repository pattern
5. Walk through one booking flow
6. Walk through one ticket flow
7. Explain notifications
8. Explain PDF and QR utilities
9. Explain dashboard analytics

## 17. Fast 60-Second Project Summary

This is a Smart Campus full-stack system built with React, Vite, Spring Boot, and MongoDB. Users can request access, browse resources, create bookings, raise issue tickets, and track everything through notifications. Admins manage resources, approve bookings, assign technicians, and monitor resource/equipment usage through the dashboard. Technicians resolve assigned tickets and generate a QR-based rating handoff. The frontend communicates with backend REST APIs through Axios, while backend business logic is organized into controllers, services, repositories, and MongoDB models.

