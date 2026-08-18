# MediTwin Project Structure

## Frontend

The MediTwin frontend is built using React and Vite.

Location:

frontend/

Main technologies:

- React
- Vite
- React Router
- Tailwind CSS
- Axios
- Recharts
- Lucide React

## Backend

The MediTwin backend is built using Node.js and Express.

Location:

backend/

Main technologies:

- Node.js
- Express
- CORS
- JWT authentication
- bcryptjs
- Prisma
- SQLite

## Database

The current development database uses SQLite through Prisma.

Location:

backend/prisma/

## Main Application Flow

User
↓
React Frontend
↓
Express REST API
↓
JWT Authentication
↓
Prisma
↓
SQLite Database
