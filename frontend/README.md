# Erino Leads Frontend

This is the frontend for the Erino Leads Management System, built with React, Vite, Mantine, Tailwind CSS, React Query, and AG Grid.

## Features

- User authentication (JWT via cookies, context-based)
- Protected and public routes
- User registration and login
- Leads table with server-side filtering, sorting, and pagination (AG Grid)
- Create, edit, and delete leads (modal forms)
- Bulk delete and CSV export
- Responsive, modern UI (Mantine, Tailwind)
- Toast notifications for feedback

## Tech Stack

- React (Vite)
- Mantine UI
- Tailwind CSS
- React Query
- AG Grid
- js-cookie

![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) ![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB&style=for-the-badge) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black&style=for-the-badge) ![Mantine](https://img.shields.io/badge/Mantine-UI-blue?logo=mantine&style=for-the-badge) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![React Query](https://img.shields.io/badge/React_Query-FF4154?logo=react-query&style=for-the-badge) ![AG Grid](https://img.shields.io/badge/AG_Grid-FA6400?logo=ag-grid&style=for-the-badge)


## Getting Started

### 1. Install dependencies

```bash
cd frontend
npm install
```

```bash
cd frontend
npm install
```

### 2. Configure Environment

Create a `.env` file if you need to override the API URL (defaults to `/api`). Example:

```
VITE_API_URL=http://localhost:5000/api
```

### 3. Run the App

```bash
npm run dev
```

The app will be available at `http://localhost:3000` by default.

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build

## Project Structure

- `src/`
  - `api/` — API functions for backend communication
  - `components/` — Reusable UI components (Navbar, etc.)
  - `context/` — Auth context provider
  - `pages/` — App pages (Login, Register, Leads, etc.)
  - `App.jsx` — Main app and routing
  - `main.jsx` — Entry point

## Authentication

- Auth state is managed via cookies and React context
- Protected routes redirect unauthenticated users to login
- User info and logout are shown in the navbar when logged in

## Leads Table

- Uses AG Grid for advanced table features
- Server-side pagination, filtering, and sorting
- Create/Edit modal for leads
- Bulk delete and CSV export

## License
  ![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

