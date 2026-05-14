# Smart Campus Management System

## Overview

A comprehensive web-based platform for managing campus resources, bookings, and maintenance tickets. This system enables students, faculty, and administrators to efficiently manage resource reservations, report issues, and track maintenance activities in a smart campus environment.

## Features

### User Management
- Role-based access control (Admin, Technician, User)
- Secure authentication and authorization
- User profile management

### Resource Management
- Browse and filter available campus resources
- Real-time availability checking
- Resource categorization and details

### Booking System
- Online resource reservation
- Booking status tracking
- Automated approval workflows
- PDF booking confirmations

### Maintenance Ticketing
- Issue reporting and tracking
- Technician assignment
- Resolution tracking and notes
- Status updates and notifications

### Notification System
- Real-time notifications
- Email alerts for booking confirmations
- Status update notifications

### Administrative Dashboard
- System-wide analytics and statistics
- User management
- Resource and booking oversight
- Technician assignment management

## Technology Stack

### Backend
- **Java 17+**
- **Spring Boot** - REST API framework
- **Spring Security** - Authentication and authorization
- **JPA/Hibernate** - ORM for database operations
- **H2/MySQL** - Database
- **Flyway** - Database migrations
- **Maven** - Build tool

### Frontend
- **React 18+** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling framework
- **ESLint** - Code linting

## Prerequisites

- Java 17 or higher
- Node.js 18+ and npm
- Maven 3.6+

## Installation and Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Configure the database in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:h2:mem:smartcampus
   spring.datasource.driverClassName=org.h2.Driver
   spring.datasource.username=sa
   spring.datasource.password=password
   spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
   ```

3. Run database migrations:
   ```bash
   ./mvnw flyway:migrate
   ```

4. Start the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will start on `http://localhost:5173`

## Usage

1. Access the application at `http://localhost:5173`
2. Register as a new user or login with existing credentials
3. Browse available resources and make bookings
4. Submit maintenance tickets for issues
5. Administrators can manage users, resources, and assignments
6. Technicians can view and resolve assigned tickets

## API Documentation

The REST API endpoints are documented and available at `http://localhost:8080/swagger-ui.html` when the backend is running.

## Project Structure

```
├── backend/                 # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/        # Java source files
│   │   │   └── resources/   # Configuration files
│   │   └── test/            # Unit tests
│   ├── pom.xml             # Maven configuration
│   └── mvnw                # Maven wrapper
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── api/            # API service functions
│   │   ├── context/        # React context providers
│   │   └── utils/          # Utility functions
│   ├── package.json        # Node dependencies
│   └── vite.config.js      # Vite configuration
└── docs/                   # Documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Team

- Group 334 - IT3030 PAF 2026

## License

This project is licensed under the MIT License - see the LICENSE file for details.