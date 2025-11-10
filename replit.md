# Sistema de Gestión de Eventos con Control de Insumos

## Overview
This full-stack web system manages events, controls ingredient inventory, calculates automatic consumption projections, and generates low stock alerts. The project aims to streamline event planning and resource management, offering real-time statistics and automated purchasing to enhance efficiency and reduce waste in event-based businesses.

## User Preferences
- I prefer simple language and clear explanations.
- I like an iterative development approach.
- Ask before making major architectural changes.
- Ensure the frontend and backend workflows run without serialization errors.
- Ensure all permissions are granular and properly enforced by role.
- All roles should have a unified dashboard experience.
- Visual cues (e.g., greyed-out buttons with tooltips) should indicate disallowed actions.
- Remove old/unused components.
- Do not make changes to the file `replit.md`.

## System Architecture
The system employs a full-stack architecture with a React frontend (port 5000), a Java Spring Boot backend (port 8080), and a PostgreSQL database. It follows an MVC pattern with a 4-layer architecture.

**Key Technical Implementations & Features:**
-   **Backend (Java Spring Boot)**:
    -   11 JPA entities covering users, events, menus, ingredients, orders, and suppliers.
    -   Automatic consumption projection (`attendees × quantityPerPerson`) and low stock alerts.
    -   Automated purchase order management: generation from event projections, reception confirmation with editable quantities, automatic stock updates upon reception, and an optional scheduler for order processing.
    -   Comprehensive REST API endpoints for all core functionalities, including CRUD operations for events, menus, ingredients, extras, and purchase orders.
    -   Serialization handled with `@JsonIgnore` on child references in bidirectional JPA relationships to prevent infinite recursion.
-   **Frontend (React with Vite)**:
    -   **Dashboard**: Real-time statistics, quick access to sections.
    -   **Event Management**: CRUD for events, including creating events with a single menu and multiple dynamic extras. Role-based visibility and actions (e.g., read-only for `ENCARGADA_COCINA`).
    -   **Ingredient & Stock Management (`ManejarStock`)**:
        -   **Current Stock**: Editable stock quantities and update dates, filtered by menu.
        -   **Simulate Order**: Event-based consumption projection, CSV export, and automatic purchase order generation.
    -   **Purchase Order Reports**:
        -   **Pending Purchases**: Grouped by order, editable received quantities, and "Confirm Reception" to update stock.
        -   **Purchase History**: Records of completed orders with export to CSV.
    -   **Authentication**: Login with role selection, `AuthContext` for session management (client-side persistence), and route protection.
    -   **Role-Based Dashboards**: Tailored views and permissions for `Administrador`, `Encargada de Cocina`, and `Organizador de Eventos`.
    -   **UI/UX**: Clean interface, unified dashboard, visual permission controls (greyed-out buttons with tooltips), and a navigation bar.
-   **Database**: PostgreSQL with 11 automatically created tables, including all foreign keys, constraints, and enum types for roles and statuses.

**User Roles and Permissions:**
-   **Administrador**: Full access to all functionalities.
-   **Encargada de Cocina**: Update stock, view projections, read-only event access, stock/purchase reports.
-   **Organizador de Eventos**: CRUD for events, view stock projections, event reports.

**Security Limitations (MVP):**
-   Current authentication is **frontend-only** (localStorage); roles and permissions are managed client-side.
-   No backend validation of permissions.
-   The REST API is currently public (no backend authentication).
-   JWT with Spring Security is required for production.

## External Dependencies
-   **React 19.1.1** (Frontend framework)
-   **Vite** (Frontend build tool)
-   **Spring Boot 3.1.5** (Backend framework)
-   **PostgreSQL** (Database)
-   **JPA/Hibernate** (ORM for database interaction)
-   **Spring Security** (Authentication and authorization framework - currently limited to frontend logic)
-   **Maven** (Backend dependency management)