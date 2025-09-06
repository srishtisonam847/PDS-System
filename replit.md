# Public Distribution System (PDS) Management Application

## Overview

A web application for managing Public Distribution System (PDS) operations, designed to handle stock tracking and allocation for essential commodities like rice, wheat, sugar, and kerosene. The system serves three distinct user roles: shop owners who manage inventory, beneficiaries who track their allocations, and administrators who oversee the entire system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite for fast development and building
- **Styling**: TailwindCSS with shadcn/ui component library for consistent, modern UI components
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management with local storage for authentication
- **Form Handling**: React Hook Form with Zod validation for type-safe form processing
- **Charts**: Recharts library for data visualization and analytics dashboards

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Development**: tsx for TypeScript execution in development
- **Database Layer**: Drizzle ORM with PostgreSQL dialect
- **Storage**: In-memory storage implementation for development, with interface designed for easy database migration
- **API Design**: RESTful endpoints with consistent JSON responses and centralized error handling

### Authentication & Authorization
- **Authentication**: Simple credential-based login with role-based access control
- **Session Management**: Client-side user data persistence using localStorage
- **Role-based Access**: Three distinct user roles (shop, beneficiary, admin) with role-specific dashboards and functionality
- **Route Protection**: Client-side route guards that redirect unauthenticated users

### Data Models
- **Users**: Central user entity with role-based differentiation and shop associations
- **Shops**: Physical ration shop locations with contact information
- **Stock**: Real-time inventory tracking by shop and commodity type with quantity and unit management
- **Beneficiaries**: Links users to specific shops with ration card numbers and family size data

### Component Architecture
- **Reusable Components**: Modular UI components including StockCard, ChartComponent, Sidebar, and Notification systems
- **Dashboard Views**: Role-specific dashboard layouts with appropriate data visualization and management tools
- **Form Components**: Consistent form handling with validation and error display
- **Layout System**: Responsive design with mobile-first approach using TailwindCSS utilities

## External Dependencies

### Database & ORM
- **Drizzle ORM**: Type-safe database operations with PostgreSQL support
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **Drizzle Kit**: Database migration and schema management tools

### UI & Styling
- **Radix UI**: Accessible, unstyled UI primitives for building the component library
- **TailwindCSS**: Utility-first CSS framework for rapid UI development
- **Lucide React**: Consistent iconography throughout the application
- **Recharts**: Data visualization library for stock trends and analytics

### Development & Build Tools
- **Vite**: Fast build tool with hot module replacement and development server
- **TypeScript**: Static type checking and enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with autoprefixer support

### Form & Validation
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: Runtime type validation and schema definition
- **@hookform/resolvers**: Integration between React Hook Form and Zod validation

### Utility Libraries
- **date-fns**: Date manipulation and formatting utilities
- **clsx & class-variance-authority**: Dynamic CSS class management
- **nanoid**: Unique ID generation for client-side operations