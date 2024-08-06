# ChronoCaster Backend

This backend is developed using Laravel 11, integrating Auth0 for authentication and Spatie Laravel-Permission for role and permission management. The backend is structured to support a flexible hierarchy suitable for various use cases, including live events, podcasts, and conferences.

## Table of Contents

- [Hierarchy and Naming Conventions](#hierarchy-and-naming-conventions)
- [Authentication and Authorization](#authentication-and-authorization)
- [Roles and Permissions](#roles-and-permissions)
- [Database Setup](#database-setup)
- [Development Setup](#development-setup)
- [API Endpoints](#api-endpoints)
- [Real-Time Functionality](#real-time-functionality)
- [Deployment](#deployment)

## Hierarchy and Naming Conventions

The application features a hierarchical structure that can be adapted for various scenarios. The levels in the hierarchy are as follows:

1. **Application**: The top-level entity representing the entire platform.
2. **Organization**: Represents a specific organization or group within the application.
3. **Programs**: Entities under an organization, such as shows, conferences, or series.
4. **Units**: Subdivisions within a program, such as episodes, sessions, or segments.
5. **Segments**: The most granular level, representing individual sections within a unit.

Each level can be customized by administrators, allowing them to rename these levels as per the use case.

## Authentication and Authorization

### Authentication

- **Provider**: Auth0 is used for secure user authentication.
- **Methods**: Supports login via Google and email/password.
- **Middleware**: Custom middleware (`Auth0Middleware`) ensures that routes are protected and accessible only to authenticated users.

### Authorization

- **Package**: Spatie Laravel-Permission is utilized to manage roles and permissions.
- **Role-Based Access Control (RBAC)**: Roles determine the level of access a user has, while permissions define the specific actions users can perform.

## Roles and Permissions

### Roles

- **Super Admin**: Full access across all levels, including management and editing.
- **Org Admin**: Can manage their organization, including creating and managing programs, units, and segments.
- **Program Manager**: Manages specific programs and their respective units and segments.
- **Unit Manager**: Manages specific units and their segments.
- **Viewer**: Can view specified levels without making any changes.

### Permissions

Permissions are defined for each level of access, including:

- `view_application`, `manage_application`, `edit_application`
- `view_organization`, `manage_organization`, `edit_organization`
- `view_program`, `manage_program`, `edit_program`
- `view_unit`, `manage_unit`, `edit_unit`
- `view_segment`, `manage_segment`, `edit_segment`

These permissions are assigned to roles, controlling what users can do within the application.

## Database Setup

### Migrations and Seeders

- **Migrations**: Define the database schema for users, roles, permissions, programs, units, and segments.
- **Seeders**: Populate the database with initial data, including test users, roles, and permissions.

### Relationships

- **Programs** have many **Units**.
- **Units** have many **Segments**.
- **Users** are associated with roles that grant them specific permissions.

## Development Setup

### Prerequisites

- **PHP**: Ensure PHP is installed and configured.
- **Composer**: Use Composer to manage dependencies.
- **SQLite**: The development environment uses SQLite for the database.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/chronocaster-backend.git
   cd chronocaster-backend
   ```

2. Install dependencies:

   ```bash
   composer install
   ```

3. Set up environment variables:

   Copy the `.env.example` file to `.env` and configure your environment variables, including database connection and Auth0 credentials.

4. Run migrations and seed the database:

   ```bash
   php artisan migrate --seed
   ```

### Running the Application

Start the Laravel development server:

```bash
php artisan serve
```

## API Endpoints

### Programs

- **Create**: `POST /programs`
- **Read**: `GET /programs`
- **Update**: `PUT /programs/{program}`
- **Delete**: `DELETE /programs/{program}`

### Units

- **Create**: `POST /programs/{program}/units`
- **Read**: `GET /programs/{program}/units`
- **Update**: `PUT /units/{unit}`
- **Delete**: `DELETE /units/{unit}`

### Segments

- **Create**: `POST /units/{unit}/segments`
- **Read**: `GET /units/{unit}/segments`
- **Update**: `PUT /segments/{segment}`
- **Delete**: `DELETE /segments/{segment}`

## Real-Time Functionality

The backend supports real-time updates using Laravel Echo and Pusher. This feature is designed to track live changes in Programs, Units, and Segments, providing up-to-date information to all users.

## Deployment

For deployment, ensure that the production environment variables are correctly configured. Set up a CI/CD pipeline for automated testing and deployment. Monitor the application using appropriate logging and monitoring tools.



<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com/)**
- **[Tighten Co.](https://tighten.co)**
- **[WebReinvent](https://webreinvent.com/)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel/)**
- **[Cyber-Duck](https://cyber-duck.co.uk)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Jump24](https://jump24.co.uk)**
- **[Redberry](https://redberry.international/laravel/)**
- **[Active Logic](https://activelogic.com)**
- **[byte5](https://byte5.de)**
- **[OP.GG](https://op.gg)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
