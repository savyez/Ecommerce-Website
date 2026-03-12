# ShopEz Ecommerce Platform

ShopEz is a full-stack ecommerce application built as a backend-first project with an actively integrated frontend. The repository contains a Node.js + Express + MongoDB API and a React + Vite client that already consumes live product data through Redux Toolkit.

This README is the project-level document for the entire repository. It explains the system as a complete application, how the backend and frontend fit together, what is implemented today, and how the codebase is organized for further growth.

For module-specific documentation:

- Backend documentation: [backend/README.md](./backend/README.md)
- Frontend documentation: [frontend/README.md](./frontend/README.md)

## Project Summary

The goal of this project is to implement the core architecture of an ecommerce system with:

- JWT-based authentication
- role-based authorization for admin actions
- product catalog browsing
- product reviews and ratings
- order management
- a React storefront consuming the backend API

The codebase is structured to reflect real application boundaries rather than a tutorial-style single-file implementation.

## High-Level Architecture

The repository is split into two application layers:

```text
Ecommerce/
|- backend/
|  |- config/
|  |- controller/
|  |- middleware/
|  |- models/
|  |- routes/
|  `- utils/
|- frontend/
|  |- public/
|  `- src/
|- package.json
`- README.md
```

### Backend role

The backend is the business engine of the platform. It is responsible for:

- user authentication and session handling
- access control
- product CRUD and reviews
- order creation and admin order management
- email-based password reset
- persistence through MongoDB

### Frontend role

The frontend is the presentation and interaction layer. It is responsible for:

- rendering the storefront UI
- calling backend APIs
- holding client-side global state
- providing reusable visual components
- composing page-level experiences

## End-to-End Request Flow

The current primary product flow works like this:

1. The browser loads the frontend route `/`.
2. `Home.jsx` mounts in the React app.
3. The frontend dispatches `getProduct()` through Redux Toolkit.
4. Axios calls `/api/v1/products`.
5. Vite proxies the request to the local backend.
6. Express routes the request to the product controller.
7. The backend queries MongoDB through Mongoose.
8. The API returns product data and pagination metadata.
9. Redux updates `loading`, `products`, and `productCount`.
10. The frontend re-renders the product cards.

This is the first fully connected backend-to-frontend path in the project and acts as the pattern for future features.

## Technology Stack

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Tokens
- bcryptjs
- cookie-parser
- nodemailer

### Frontend

- React 19
- Vite
- React Router
- Redux Toolkit
- React Redux
- Axios
- Material UI icons

## Repository Design

The codebase is intentionally layered.

### Backend structure

- `routes/` defines URLs and middleware composition
- `controller/` contains request and business logic
- `models/` defines persistence rules and schema behavior
- `middleware/` handles auth, async wrapping, and error translation
- `utils/` contains reusable helpers such as JWT handling and API query helpers

### Frontend structure

- `pages/` contains route-level screens
- `components/` contains reusable UI parts
- `features/` contains Redux domain logic
- `app/` contains store configuration
- style folders are separated by domain and responsibility

This structure keeps the project understandable at interview scale and maintainable at product scale.

## Core Capabilities

### Authentication and authorization

Implemented backend auth capabilities:

- user registration
- user login
- logout
- profile retrieval and update
- password update
- forgot-password flow
- password reset through token
- admin user listing
- admin role changes
- admin user deletion

Auth design:

- JWTs are generated on login/registration
- tokens are stored in HTTP-only cookies
- protected routes load the current user from the token
- admin routes use role-based middleware

### Product module

Implemented product capabilities:

- public product listing
- product search
- product filtering
- pagination
- single-product retrieval
- admin product create/update/delete
- product review create/update
- product review retrieval
- product review deletion

Backend support for product listing includes reusable query logic through `apiFunctionality.js`.

### Order module

Implemented order capabilities:

- authenticated order creation
- logged-in user order history
- admin order listing
- admin single-order view
- admin order status update
- admin order deletion under defined conditions

The order status update flow also changes stock levels for ordered items.

### Frontend storefront foundation

Implemented frontend capabilities:

- routed single-page application shell
- homepage composition
- live product fetch from the backend
- Redux-managed product state
- loading state rendering
- reusable navbar, footer, product card, rating, and image slider components
- Vite proxy integration for backend communication

## Current Application Surfaces

### Backend route groups

All backend routes are mounted under:

```text
/api/v1
```

Main route groups:

- auth and user management
- product and review management
- order management

### Frontend routes

Current frontend route tree:

- `/` -> `Home`

The frontend structure is already prepared to expand into product details, cart, checkout, user profile, and admin routes.

## Data Model Overview

The backend currently revolves around three main entities:

### User

Represents:

- account identity
- authentication credentials
- role
- password reset state

### Product

Represents:

- catalog item metadata
- pricing
- stock
- images
- reviews and aggregate rating
- creating admin/user reference

### Order

Represents:

- shipping information
- ordered products
- payment information
- price breakdown
- lifecycle state such as processing or delivered

### Model relationships

At a conceptual level:

- one user can create many orders
- one user can author many product reviews
- one product can have many reviews
- one order contains many order items
- each order item points to one product

## API and Frontend Integration

The frontend currently talks to the backend using Axios and a Vite development proxy.

### Frontend API call style

Example call pattern:

```text
/api/v1/products
```

### Why the proxy exists

The Vite proxy allows the frontend to call `/api/...` without hardcoding `http://127.0.0.1:8000` in UI components. During development, requests are forwarded to the Express server automatically.

This keeps the frontend cleaner and makes local integration easier.

## State Management

Redux Toolkit is already wired into the frontend.

Current global state coverage:

- product list
- product count
- loading status
- error state

This is important because it shows the frontend is no longer just static UI. It has already moved into application-state territory.

## Documentation Layout

This root README gives the system-level overview.

For deeper implementation detail:

- use `backend/README.md` for API, auth, models, routes, middleware, and backend flow
- use `frontend/README.md` for page composition, Redux flow, UI structure, and frontend dev workflow

This documentation split mirrors the codebase split.

## Local Development

### Prerequisites

- Node.js 18+
- MongoDB instance available locally or remotely

### Install dependencies

From the repository root:

```bash
npm install
```

From the frontend directory:

```bash
cd frontend
npm install
```

### Configure backend environment variables

Create or update:

```text
backend/config/config.env
```

Typical values:

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

### Run the backend

From the repository root:

```bash
npm start
```

### Run the frontend

From the `frontend/` directory:

```bash
npm run dev
```

## Scripts

### Root

- `npm start` -> starts the backend through nodemon

### Frontend

- `npm run dev` -> start Vite dev server
- `npm run build` -> create production build
- `npm run preview` -> preview production build
- `npm run lint` -> run ESLint

## Strengths of the Current Implementation

- clear separation of backend concerns
- real authentication and role-based access control
- reusable product query helper on the backend
- end-to-end product data flow into the frontend
- Redux already integrated rather than deferred
- frontend component structure ready for expansion
- backend and frontend both documented independently

## Current Maturity Level

This project should be understood as:

- beyond a starter scaffold
- not yet a fully complete production ecommerce application
- already strong enough to demonstrate architectural thinking, API design, state flow, and code organization

The backend is broader and more mature than the frontend today, but the frontend has already crossed the line from static mockup to integrated application client.

## Known Gaps and Next Logical Steps

The most natural next steps are:

- expand routing beyond the homepage
- build product details and catalog pages
- connect cart, shipping, payment, and order screens
- improve request validation and frontend error presentation
- add automated tests for backend flows and frontend state transitions
- remove committed secrets from tracked configuration
- strengthen consistency around naming and some route semantics

