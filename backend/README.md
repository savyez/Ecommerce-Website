# Backend Documentation

This document describes the backend of the ecommerce project as an API service, not just as a folder in the repository. It is intended to give a reviewer enough context to understand how requests flow through the system, how the main business entities are modeled, and how authentication, authorization, product management, reviews, and orders are implemented.

## Purpose

The backend is a Node.js + Express + MongoDB service that powers:

- user registration, login, logout, and password recovery
- role-based admin access
- product listing, filtering, pagination, and reviews
- order creation and order administration

All public and protected API routes are mounted under:

```text
/api/v1
```

## Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- JWT authentication
- HTTP-only cookies
- bcrypt password hashing
- nodemailer for password reset email

## Backend Structure

```text
backend/
├── app.js
├── server.js
├── config/
│   ├── config.env
│   └── db.js
├── controller/
│   ├── orderController.js
│   ├── productController.js
│   └── userController.js
├── middleware/
│   ├── error.js
│   ├── handleAsyncError.js
│   └── userAuth.js
├── models/
│   ├── orderModel.js
│   ├── productModel.js
│   └── userModel.js
├── routes/
│   ├── orderRoutes.js
│   ├── productRoutes.js
│   └── userRoutes.js
└── utils/
    ├── apiFunctionality.js
    ├── handleError.js
    ├── jwtToken.js
    └── sendEmail.js
```

## Runtime Flow

### `server.js`

`server.js` is the backend entrypoint. It performs four core tasks:

1. Loads environment variables from `backend/config/config.env`
2. Connects to MongoDB
3. Starts the Express server
4. Handles `uncaughtException` and `unhandledRejection` process failures

This means the server is intentionally defensive at the process boundary and will shut down instead of continuing in a bad state after critical unhandled failures.

### `app.js`

`app.js` builds the Express application instance. It currently wires:

- `express.json()` for JSON request bodies
- `cookie-parser` for cookie-based auth
- product routes
- user routes
- order routes
- centralized error middleware

## Architectural Pattern

The backend follows a standard layered Express structure:

- `routes/` defines endpoint URLs and middleware composition
- `controller/` contains business logic per feature
- `models/` defines MongoDB persistence rules
- `middleware/` handles auth, async error wrapping, and error normalization
- `utils/` contains reusable helpers used across modules

This separation keeps route definitions thin and makes controllers the primary place for business rules.

## Authentication and Authorization

Authentication is implemented with JWTs stored in an HTTP-only cookie named `token`.

### Login / registration flow

When a user registers or logs in:

1. the backend validates credentials
2. a JWT is created through the `User` model method `getJWTToken()`
3. `sendToken()` sends both:
   - the cookie
   - the token and user object in the JSON response

### Route protection

Protected routes use:

- `verifyUserAuth`

This middleware:

- reads `req.cookies.token`
- verifies the token using `JWT_SECRET_KEY`
- loads the user from MongoDB
- attaches the user document to `req.user`

### Role-based access

Admin-only routes use:

- `roleBasedAccess("admin")`

This middleware checks `req.user.role` and rejects unauthorized roles with HTTP `403`.

## Error Handling Strategy

The backend uses a centralized error pattern:

- `handleAsyncError.js` wraps async controllers and forwards errors to `next()`
- `HandleError` standardizes custom application errors
- `middleware/error.js` converts known failures into consistent JSON responses

### Explicitly handled cases

- invalid MongoDB `ObjectId` access (`CastError`)
- duplicate key errors such as repeated email registration (`E11000`)

### Standard error response shape

```json
{
  "success": false,
  "message": "Error message here"
}
```

## Data Model Design

### User Model

The `User` schema stores:

- `name`
- `email`
- `password`
- `avatar.public_id`
- `avatar.url`
- `role`
- `resetPasswordToken`
- `resetPasswordExpire`
- timestamps

### Important behaviors

- password is hashed in a Mongoose pre-save hook
- password field is excluded by default with `select: false`
- JWT generation is implemented as a model method
- password comparison is implemented as a model method
- password reset token creation is implemented as a model method

### Product Model

The `Product` schema stores:

- `name`
- `description`
- `price`
- `ratings`
- `image[]`
- `category`
- `stock`
- `numOfReviews`
- embedded `reviews[]`
- `user` reference to the creator/admin
- `createdAt`

### Embedded review shape

Each review stores:

- `user`
- `name`
- `rating`
- `comment`

This makes read access for product reviews straightforward without a separate review collection.

### Order Model

The `Order` schema stores:

- `shippingInfo`
- `orderItems[]`
- `orderStatus`
- `user`
- `paymentInfo`
- `paidAt`
- `itemPrice`
- `taxPrice`
- `shippingPrice`
- `totalPrice`
- `deliveredAt`
- `createdAt`

### Order item shape

Each order item stores:

- `name`
- `price`
- `quantity`
- `image`
- `product` reference

## Feature Modules

### Product Module

The product feature supports both public browsing and admin management.

#### Public capabilities

- fetch all products
- fetch a single product
- search by keyword
- filter via query string
- paginate product results
- fetch reviews for a product

#### Authenticated capabilities

- create or update a review
- delete a review

#### Admin capabilities

- create product
- update product
- delete product
- fetch full product list for administration

### Product query helper

`utils/apiFunctionality.js` encapsulates:

- keyword search
- generic filtering
- pagination

This keeps controller code smaller and avoids duplicating query logic.

### User Module

The user module handles both authentication and profile management.

#### Public capabilities

- register
- login
- logout
- request password reset
- reset password via token

#### Authenticated user capabilities

- fetch own profile
- update own profile
- update own password

#### Admin capabilities

- list all users
- fetch a single user
- change user role
- delete user

### Password reset flow

The reset process works as follows:

1. User submits email to `/password/forgot`
2. Backend generates a random reset token
3. A hashed version is stored in the database with an expiry timestamp
4. A reset link is emailed to the user
5. User posts new password to `/reset/:token`
6. Backend verifies token validity and expiry before updating password

### Order Module

The order module supports both customer and admin use cases.

#### Authenticated customer capabilities

- create a new order
- retrieve all orders for the logged-in user

#### Admin capabilities

- fetch a single order
- fetch all orders
- update order status
- delete delivered orders

### Order processing behavior

When order status is updated, the backend currently:

- iterates through order items
- reduces product stock
- marks `deliveredAt` when the new status is `Delivered`

This makes order status changes operationally significant, not just cosmetic.

## Route Catalog

All routes below are mounted under `/api/v1`.

### Product Routes

| Method | Path | Access | Purpose |
|---|---|---|---|
| `GET` | `/products` | Public | List products with search/filter/pagination |
| `GET` | `/product/:id` | Public | Get a single product |
| `GET` | `/reviews` | Public | Get reviews for a product via query params |
| `PUT` | `/review` | Authenticated | Create or update a review |
| `DELETE` | `/reviews` | Authenticated | Delete a review |
| `GET` | `/admin/products` | Admin | List all products for admin |
| `POST` | `/admin/product/create` | Admin | Create product |
| `PUT` | `/admin/product/:id` | Admin | Update product |
| `DELETE` | `/admin/product/:id` | Admin | Delete product |

### User Routes

| Method | Path | Access | Purpose |
|---|---|---|---|
| `POST` | `/register` | Public | Register a new user |
| `POST` | `/login` | Public | Login |
| `POST` | `/logout` | Public | Logout |
| `POST` | `/password/forgot` | Public | Start password reset flow |
| `POST` | `/reset/:token` | Public | Reset password |
| `POST` | `/profile` | Authenticated | Get current user profile |
| `POST` | `/profile/update` | Authenticated | Update profile |
| `POST` | `/password/update` | Authenticated | Change password |
| `GET` | `/admin/users` | Admin | List all users |
| `GET` | `/admin/user/:id` | Admin | Get one user |
| `PUT` | `/admin/user/:id` | Admin | Update user role |
| `DELETE` | `/admin/user/:id` | Admin | Delete user |

### Order Routes

| Method | Path | Access | Purpose |
|---|---|---|---|
| `POST` | `/new/order` | Authenticated | Create order |
| `GET` | `/orders/user` | Authenticated | List current user orders |
| `GET` | `/admin/orders` | Admin | List all orders |
| `GET` | `/admin/order/:id` | Admin | Get one order |
| `PUT` | `/admin/order/:id` | Admin | Update order status |
| `DELETE` | `/admin/order/:id` | Admin | Delete delivered order |

## Request/Response Notes

### Product listing

The product listing endpoint returns:

- `products`
- `productCount`
- `resultsPerPage`
- `totalPages`
- `currentPage`

### Auth responses

Successful authentication responses include:

- `success`
- `user`
- `token`

The token is also stored in a cookie.

### Review deletion

The review deletion path expects query parameters for:

- `productId`
- `id` for the review

### Order aggregation

The admin order listing response also returns:

- `totalAmount`

This is computed by summing the `totalPrice` across all fetched orders.

## Environment Variables

The backend expects environment variables in `backend/config/config.env`.

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

### Important note

Production-grade secrets should never be committed into version control. They should be injected via deployment environment configuration.

## Running the Backend

From the repository root:

```bash
npm install
npm start
```

The root start script runs:

```bash
nodemon backend/server.js
```

Default configured port:

```text
8000
```

## Current Strengths

- clear route/controller/model separation
- practical JWT cookie auth flow
- role-based admin security
- centralized async and runtime error handling
- reusable product query helper
- end-to-end backend coverage for users, products, reviews, and orders

## Known Implementation Notes

This README describes the backend as it exists now. A reviewer should know these current realities:

- the project is functional but still evolving
- some route naming choices can be normalized further
- some data validation can be strengthened at the request boundary
- some logic currently trusts incoming client pricing/order values more than a hardened production implementation should

These are normal next-step refinements rather than architectural blockers.
