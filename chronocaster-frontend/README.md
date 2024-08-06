
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


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
