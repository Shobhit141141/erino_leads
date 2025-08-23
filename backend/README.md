# Erino Leads Backend

This is the backend API for the Erino Leads Management System, built with Node.js, Express, Sequelize (PostgreSQL), and JWT authentication.

## Features

- User authentication (JWT, cookies)
- User CRUD (admin only)
- Leads CRUD (with advanced filtering, pagination, and user association)
- Centralized routing, CORS, and 404 handling
- Model-level validation
- Seed script for demo data

## Tech Stack

- Node.js, Express
- Sequelize ORM (PostgreSQL)
- JWT, bcryptjs, cookie-parser
- dotenv, cors

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge) ![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white&style=for-the-badge) ![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?logo=sequelize&logoColor=white&style=for-the-badge) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white&style=for-the-badge) ![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white&style=for-the-badge) ![bcryptjs](https://img.shields.io/badge/bcryptjs-003A70?logo=javascript&logoColor=white&style=for-the-badge) ![cookie-parser](https://img.shields.io/badge/cookie--parser-4B8BBE?logo=javascript&logoColor=white&style=for-the-badge)

## Getting Started

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Create a `.env` file in the backend directory:

```
PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/erino_leads
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

### 3. Database Setup

- Ensure PostgreSQL is running and the database exists.
- Sequelize will auto-create tables on first run.

### 4. Run the Server

```bash
npm run dev
```

### 5. Seed Demo Data (Optional)

```bash
npm run seed
```

## API Endpoints

### Auth

**`bold apis`** means auth token is required

- `POST /auth/register` — Register new user
- `POST /auth/login` — Login, sets JWT cookie
- **`POST /auth/logout`** — Logout, clears cookie

### Users 

- **`GET /user`** — List users 
- **`GET /user/:id`** — Get user by ID
- **`PUT /user/:id`** — Update user
- **`DELETE /user/:id`** — Delete user
- `POST /user/check-username` — Check if username is taken

### Leads 

- **`GET /lead`** — List leads (supports filtering, pagination)
- **`POST /lead`** — Create lead (userId set from JWT)
- **`PUT /lead/:id`** — Update lead
- **`DELETE /lead/:id`** — Delete lead
- **`POST /lead/bulk-delete`** — Bulk delete leads

## Scripts

- `npm run dev` — Start server with nodemon
- `npm run seed` — Seed database with demo leads

## License

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

