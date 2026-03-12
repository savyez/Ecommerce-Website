# Ecommerce Platform

This repository is a full-stack ecommerce application split into two independently runnable parts:

- `backend/`: a Node.js + Express + MongoDB REST API for authentication, catalog management, reviews, and order management
- `frontend/`: a React + Vite client application that currently contains the initial app shell and routing foundation

The project is being built in layers. At the current stage, the backend contains most of the business logic, while the frontend is intentionally minimal and ready to consume the API.

## Project Objective

The goal of the project is to demonstrate a production-style ecommerce architecture with:

- JWT-based authentication with HTTP-only cookies
- role-based authorization for admin-only operations
- product catalog APIs with filtering, search, pagination, and reviews
- user profile management and password reset flows
- order creation and admin order processing
- a frontend application prepared to evolve from a basic routed shell into a complete customer-facing storefront

## Tech Stack

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT (`jsonwebtoken`)
- Password hashing (`bcryptjs`)
- Email delivery (`nodemailer`)
- Cookie parsing (`cookie-parser`)

### Frontend

- React 19
- React Router
- Vite
- ESLint

## Repository Structure

```text
Ecommerce/
├── backend/
│   ├── config/
│   ├── controller/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── utils/
├── frontend/
│   ├── public/
│   └── src/
└── README.md
```

## Architecture Overview

### Backend flow

The backend follows a classic layered Express structure:

1. `routes/` defines endpoint paths and attaches middleware.
2. `middleware/` handles auth, role checks, async error capture, and centralized error formatting.
3. `controller/` contains the request handlers and business logic.
4. `models/` defines MongoDB collections using Mongoose schemas.
5. `utils/` contains reusable helpers such as JWT token handling, email sending, API query helpers, and custom errors.

### Frontend flow

The frontend is currently a starter client:

- `src/main.jsx` mounts the React application
- `src/App.jsx` configures routing
- `src/pages/Home.jsx` renders the root page at `/`

This means the backend is the core of the current implementation, while the frontend is the initial presentation layer to be expanded next.

## Implemented Backend Modules

### 1. Authentication and user management

The authentication system supports:

- user registration
- user login
- logout
- profile retrieval
- profile update
- password update
- forgot-password email flow
- password reset using a time-bound token
- admin user listing
- admin single-user lookup
- admin role updates
- admin user deletion

How it works:

- Passwords are hashed in a Mongoose pre-save hook.
- JWTs are generated in the user model and sent back in an HTTP-only cookie.
- Protected routes read the token from `req.cookies.token`.
- Admin-only routes are protected through `roleBasedAccess("admin")`.

### 2. Product management

The product module supports:

- public product listing
- public single-product lookup
- keyword-based search
- query-based filtering
- pagination
- admin product creation
- admin product update
- admin product deletion
- authenticated review creation/update
- public review retrieval
- authenticated review deletion

The API uses a dedicated `APIFunctionality` helper to keep search, filtering, and pagination logic reusable and separate from controllers.

### 3. Order management

The order module supports:

- authenticated order creation
- authenticated retrieval of the logged-in user’s orders
- admin retrieval of a single order
- admin retrieval of all orders with aggregate `totalAmount`
- admin order status update
- admin deletion of delivered orders

The order processing flow also reduces product stock when an admin updates order status through the current order handler.

## Data Model Summary

### User

The `User` model stores:

- name
- email
- hashed password
- avatar metadata
- role
- password reset token and expiry
- timestamps

### Product

The `Product` model stores:

- name
- description
- price
- ratings
- image array
- category
- stock
- review count
- embedded reviews
- reference to the user who created the product

### Order

The `Order` model stores:

- shipping information
- ordered items
- order status
- user reference
- payment info
- price breakdown
- delivery time
- creation time

## Backend API Summary

All routes are mounted under `/api/v1`.

### Auth and users

- `POST /register`
- `POST /login`
- `POST /logout`
- `POST /password/forgot`
- `POST /reset/:token`
- `POST /profile`
- `POST /profile/update`
- `POST /password/update`
- `GET /admin/users`
- `GET /admin/user/:id`
- `PUT /admin/user/:id`
- `DELETE /admin/user/:id`

### Products

- `GET /products`
- `GET /product/:id`
- `GET /reviews`
- `PUT /review`
- `DELETE /reviews`
- `GET /admin/products`
- `POST /admin/product/create`
- `PUT /admin/product/:id`
- `DELETE /admin/product/:id`

### Orders

- `POST /new/order`
- `GET /orders/user`
- `GET /admin/orders`
- `GET /admin/order/:id`
- `PUT /admin/order/:id`
- `DELETE /admin/order/:id`

## Query Features

The product listing endpoint supports:

- `keyword`: searches by product name using a case-insensitive regex
- additional query-string filters: passed directly into the Mongo query
- `page`: paginates results

Example:

```http
GET /api/v1/products?keyword=jeans&page=2
```

## Error Handling Strategy

The backend uses a consistent error-handling pattern:

- `handleAsyncError` wraps async controllers and forwards errors
- `HandleError` standardizes custom application errors
- `middleware/error.js` converts known failures into readable API responses

Currently handled explicitly:

- invalid MongoDB object IDs (`CastError`)
- duplicate key violations such as repeated email addresses

## Security and Auth Design

The project currently uses:

- password hashing with `bcryptjs`
- JWT token generation
- HTTP-only cookies for session persistence
- role-based authorization middleware

Important note for reviewers: the repository currently includes a real-looking `backend/config/config.env`. In a production-ready version, secrets should never be committed and should instead be injected through environment configuration outside the repo.

## Frontend Status

The frontend is intentionally at an early stage.

What exists today:

- Vite-based React application setup
- React Router configuration
- root `Home` page at `/`

What this means:

- the frontend is ready to grow into a full UI layer
- most of the current project complexity and interview discussion value is in the backend architecture, API design, and data flow

## Local Development Setup

### Prerequisites

- Node.js 18+
- MongoDB running locally or a MongoDB connection string

### 1. Install backend dependencies

```bash
npm install
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Configure backend environment variables

Create or update `backend/config/config.env` with values like:

```env
PORT=8000
DB_URI=mongodb://localhost:27017/Ecommerce
JWT_SECRET_KEY=your_jwt_secret
JWT_EXPIRE=3d
EXPIRE_COOKIE=2
SMTP_SERVICE=gmail
SMTP_MAIL=your_email@example.com
SMTP_PASSWORD=your_app_password
```

### 4. Start the backend

From the repository root:

```bash
npm start
```

### 5. Start the frontend

From the `frontend/` directory:

```bash
npm run dev
```

## Available Scripts

### Root

- `npm start`: starts the backend with `nodemon`

### Frontend

- `npm run dev`: starts Vite development server
- `npm run build`: creates a production build
- `npm run preview`: previews the production build
- `npm run lint`: runs ESLint

## Current Strengths

- clean separation of routes, controllers, models, middleware, and utilities
- practical auth flow with JWT cookies and role checks
- reusable API query helper for product listing
- complete review lifecycle support
- initial admin tooling for catalog, users, and orders
- straightforward structure that is easy to explain in an interview

## Current Gaps and Next Steps

This project is already useful for demonstrating backend engineering decisions, but it is still in progress. The most natural next steps are:

- build the real frontend UI for product listing, auth, cart, checkout, and admin views
- add input validation at the route boundary
- add automated tests for critical auth, review, and order flows
- move secrets out of the repository
- improve consistency in some route naming conventions
- harden order total calculation by deriving totals on the server instead of trusting client input

## Interviewer Notes

If you are reviewing this project for engineering ability, the key areas to focus on are:

- how authentication and authorization are structured
- how resource ownership and admin access are separated
- how Mongoose models support business rules
- how controllers coordinate product, user, and order flows
- how the codebase is organized to scale as features expand

At this stage, the project should be read as a backend-first ecommerce implementation with a frontend foundation already in place.
