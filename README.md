# <img src="./frontend/public/logo.png" alt="Logo" width="30" height="30" style="vertical-align: middle;" /> Erino Leads — Full Stack App


Erino Leads is a modern full-stack leads management system built with React, Vite, Mantine, Tailwind CSS, AG Grid, Node.js, Express, and Sequelize (PostgreSQL). It features robust authentication, advanced lead management, and a beautiful UI.

---

## Table of Contents

- [Backend](#backend)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
    - [1. Install dependencies](#1-install-dependencies)
    - [2. Configure Environment](#2-configure-environment)
    - [3. Database Setup](#3-database-setup)
    - [4. Run the Server](#4-run-the-server)
    - [5. Seed Demo Data (Optional)](#5-seed-demo-data-optional)
  - [API Endpoints](#api-endpoints)
  - [Scripts](#scripts)
  - [License](#license)

- [Frontend](#frontend)
  - [Features](#features-1)
  - [Tech Stack](#tech-stack-1)
  - [Getting Started](#getting-started-1)
    - [1. Install dependencies](#1-install-dependencies-1)
    - [2. Configure Environment](#2-configure-environment-1)
    - [3. Run the App](#3-run-the-app)
  - [Scripts](#scripts-1)
  - [Project Structure](#project-structure)
  - [Authentication](#authentication)
  - [Leads Table](#leads-table)
  - [License](#license-1)


---

## Backend

This is the backend API for the Erino Leads Management System, built with Node.js, Express, Sequelize (PostgreSQL), and JWT authentication.

### Features

- User authentication (JWT, cookies)
- Leads CRUD (with advanced filtering, pagination, and user association)
- Centralized routing, CORS, and 404 handling
- Model-level validation
- Seed script for demo data

### Tech Stack

- Node.js, Express
- Sequelize ORM (PostgreSQL)
- JWT, bcryptjs, cookie-parser
- dotenv, cors

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge) ![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white&style=for-the-badge) ![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?logo=sequelize&logoColor=white&style=for-the-badge) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white&style=for-the-badge) ![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white&style=for-the-badge) ![bcryptjs](https://img.shields.io/badge/bcryptjs-003A70?logo=javascript&logoColor=white&style=for-the-badge) ![cookie-parser](https://img.shields.io/badge/cookie--parser-4B8BBE?logo=javascript&logoColor=white&style=for-the-badge)

### Getting Started

#### 1. Install dependencies

```bash
cd backend
npm install
```

#### 2. Configure Environment

Create a `.env` file in the backend directory:

```
PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/erino_leads
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

#### 3. Database Setup

- Ensure PostgreSQL is running and the database exists.
- Sequelize will auto-create tables on first run.

#### 4. Run the Server

```bash
npm run dev
```

#### 5. Seed Demo Data (Optional)

```bash
npm run seed
```

### API Endpoints

**Bold endpoints require authentication.**

| Endpoint               | Method | Description                                 | Auth Required |
| ---------------------- | ------ | ------------------------------------------- | :-----------: |
| `/auth/register`       | POST   | Register new user                           |      No       |
| `/auth/login`          | POST   | Login, sets JWT cookie                      |      No       |
| `/auth/logout`         | POST   | Logout, clears cookie                       |      Yes      |
| `/user`                | GET    | List users                                  |      Yes      |
| `/user/:id`            | GET    | Get user by ID                              |      Yes      |
| `/user/:id`            | PUT    | Update user                                 |      Yes      |
| `/user/:id`            | DELETE | Delete user                                 |      Yes      |
| `/user/check-username` | POST   | Check if username is taken                  |      No       |
| `/lead`                | GET    | List leads (supports filtering, pagination) |      Yes      |
| `/lead`                | POST   | Create lead (userId set from JWT)           |      Yes      |
| `/lead/:id`            | PUT    | Update lead                                 |      Yes      |
| `/lead/:id`            | DELETE | Delete lead                                 |      Yes      |
| `/lead/bulk-delete`    | POST   | Bulk delete leads                           |      Yes      |

### Scripts

- `npm run dev` — Start server with nodemon
- `npm run seed` — Seed database with demo leads

### License

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

---

## Frontend

This is the frontend for the Erino Leads Management System, built with React, Vite, Mantine, Tailwind CSS, React Query, and AG Grid.

### Features

- User authentication (JWT via cookies, context-based)
- Bulk delete and CSV export
- Import json file for bulk creation of leads
- Filters
  - Search by name, email, company
  - Filter by status, source, and qualified status
  - Date range filters for created and last activity dates
- Protected and public routes
- User registration and login
- Leads table with server-side filtering, sorting, and pagination
- Create, edit, and delete leads (modal forms)
- Responsive, modern UI (Mantine, Tailwind)
- Toast notifications for feedback

### Tech Stack

- React (Vite)
- Mantine UI
- Tailwind CSS
- React Query
- AG Grid
- js-cookie

![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) ![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB&style=for-the-badge) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black&style=for-the-badge) ![Mantine](https://img.shields.io/badge/Mantine-UI-blue?logo=mantine&style=for-the-badge) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![React Query](https://img.shields.io/badge/React_Query-FF4154?logo=react-query&style=for-the-badge) ![AG Grid](https://img.shields.io/badge/AG_Grid-FA6400?logo=ag-grid&style=for-the-badge)

### Getting Started

#### 1. Install dependencies

```bash
cd frontend
npm install
```

#### 2. Configure Environment

Create a `.env` file if you need to override the API URL (defaults to `/api`). Example:

```
VITE_API_URL=http://localhost:5000/api
```

#### 3. Run the App

```bash
npm run dev
```

The app will be available at `http://localhost:3000` by default.

### Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build

### Project Structure

- `src/`
  - `api/` — API functions for backend communication
  - `components/` — Reusable UI components (Navbar, etc.)
  - `context/` — Auth context provider
  - `pages/` — App pages (Login, Register, Leads, etc.)
  - `App.jsx` — Main app and routing
  - `main.jsx` — Entry point

### Authentication

- Auth state is managed via cookies and React context
- Protected routes redirect unauthenticated users to login
- User info and logout are shown in the navbar when logged in

### Leads Table

- Uses AG Grid for advanced table features
- Server-side pagination, filtering, and sorting
- Create/Edit modal for leads
- Bulk delete and CSV export

### License

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)
