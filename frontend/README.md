# Frontend Documentation

This document explains the frontend of the ecommerce project as an application layer, not just as a generated Vite project. It describes how the UI is structured, how state is managed, how the frontend talks to the backend, and what parts of the storefront are already implemented versus prepared for future development.

## Purpose

The frontend is a React single-page application responsible for:

- rendering the storefront entry experience
- fetching product data from the backend
- managing client-side UI state
- providing reusable layout and presentation components
- acting as the base for future customer, cart, checkout, and admin screens

At the current stage, the frontend is intentionally early but already has the foundations needed for a full ecommerce UI:

- routing
- global styling
- Redux Toolkit state management
- backend API integration for products
- reusable components for navigation, hero content, product cards, ratings, loader, and metadata

## Tech Stack

- React 19
- Vite
- React Router
- Redux Toolkit
- React Redux
- Axios
- Material UI icons
- Emotion

## Frontend Structure

```text
frontend/
├── public/
│   └── images/
├── src/
│   ├── app/
│   │   └── store.js
│   ├── components/
│   ├── componentStyles/
│   ├── features/
│   │   └── products/
│   │       └── productSlice.js
│   ├── pages/
│   ├── pageStyles/
│   ├── AdminStyles/
│   ├── CartStyles/
│   ├── OrderStyles/
│   ├── UserStyles/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── vite.config.js
└── README.md
```

## Application Entry Flow

### `main.jsx`

`main.jsx` is the root entrypoint. It:

1. imports global CSS
2. creates the React root
3. wraps the application in `Provider`
4. injects the Redux store into the component tree

This makes Redux state accessible throughout the frontend.

### `App.jsx`

`App.jsx` defines the current route tree through `react-router-dom`.

At this stage, the route configuration is intentionally small:

- `/` renders the `Home` page

The structure is already suitable for expansion into multiple route-based pages such as products, product details, cart, profile, and admin modules.

## Architectural Pattern

The frontend follows a feature-aware but still lightweight structure:

- `components/` contains reusable UI building blocks
- `pages/` contains page-level screen composition
- `features/` contains Redux logic grouped by domain
- `app/` contains store configuration
- `componentStyles/`, `pageStyles/`, and other style folders isolate CSS by responsibility

This gives the codebase a clear path from small-project simplicity toward larger-project maintainability.

## State Management

The frontend uses Redux Toolkit for global state.

### Store

The Redux store is configured in:

- `src/app/store.js`

At present, the store includes:

- `product` slice

### Product slice

The product slice is defined in:

- `src/features/products/productSlice.js`

Its current responsibilities are:

- requesting products from the backend
- storing the fetched product list
- storing total product count
- exposing loading state
- exposing error state
- clearing stored errors

### Async API flow

The slice uses `createAsyncThunk` to call:

```text
/api/v1/products
```

The request lifecycle updates state across:

- `pending`
- `fulfilled`
- `rejected`

This is the first implemented global data flow in the frontend and establishes the pattern other slices can follow later for users, cart, orders, and admin state.

## Backend Integration

The frontend talks to the backend through Axios.

### Development proxy

Vite is configured to proxy API requests through:

- `vite.config.js`

Current proxy behavior:

- any request beginning with `/api` is forwarded to `http://127.0.0.1:8000/`

This allows frontend code to call backend routes like:

```text
/api/v1/products
```

without hardcoding the backend base URL in every component.

## Page-Level Documentation

### Home Page

The `Home` page is currently the main storefront entry page.

It is responsible for:

- setting the browser tab title
- dispatching the product fetch action on mount
- reading `loading`, `error`, and `products` from Redux state
- rendering a loader while data is being requested
- rendering the main homepage layout after data is available

### Home page composition

The page currently renders:

- `PageTitle`
- `Navbar`
- `ImageSlider`
- product list section
- `Footer`

This makes `Home.jsx` the first complete page-level composition point in the frontend.

## Reusable Components

### Navbar

`Navbar.jsx` is the primary top navigation component.

It currently includes:

- brand title (`ShopEz`)
- home/products/about/contact links
- cart icon and badge
- register icon when not authenticated
- mobile hamburger menu state

This component is already structured for responsive navigation and future auth-aware behavior.

### Footer

`Footer.jsx` provides the site footer and contains:

- contact details
- social placeholders
- an about section
- footer copyright

### ImageSlider

`ImageSlider.jsx` provides the homepage hero slider.

It currently supports:

- automatic timed slide transitions
- manual slide changes through dots
- local image asset rotation from `public/images`

### Product

`Product.jsx` is the reusable product card component used to render products on the homepage.

It currently shows:

- product image
- product title
- price
- rating visualization
- review count
- call-to-action button

This component is intended to be reused across catalog and listing pages.

### Rating

`Rating.jsx` renders a five-star rating view.

It supports:

- star rendering based on numeric value
- hover interaction
- click-based selection logic
- disabled display mode when ratings are only being viewed

### Loader

`Loader.jsx` is a simple reusable loading component used while async data is being fetched.

### PageTitle

`PageTitle.jsx` updates `document.title` for page-level SEO and browser clarity.

Even though it is small, it introduces a good separation between page rendering and metadata concerns.

## Styling Strategy

The frontend uses plain CSS organized by responsibility rather than CSS-in-JS or a utility-first framework.

### Global theme

`src/index.css` defines global theme variables such as:

- primary colors
- background colors
- text colors
- border colors
- shared shadows

This creates a single source of truth for the visual system.

### Style folders

The project separates styles into:

- `componentStyles/` for reusable UI parts
- `pageStyles/` for page composition
- `AdminStyles/` for future admin screens
- `CartStyles/` for cart and checkout screens
- `OrderStyles/` for order-related screens
- `UserStyles/` for profile and auth-oriented screens

Even though many of these style files are preparatory, the folder structure signals the intended application scale and domain separation.

## Public Assets

The `public/images/` directory currently stores reusable image assets such as:

- homepage banners
- fallback/profile-related images

These assets are consumed directly by components such as the image slider and product cards.

## Current Route and Data Flow

At present, the active frontend flow is:

1. user lands on `/`
2. `Home.jsx` mounts
3. `getProduct()` thunk is dispatched
4. Axios requests `/api/v1/products`
5. Redux updates `loading`, `products`, and `productCount`
6. `Home.jsx` re-renders using the fetched product list
7. each product is rendered through `Product.jsx`

This is the primary implemented end-to-end frontend flow in the project today.

## Current Strengths

- clear separation between app shell, components, pages, and features
- Redux Toolkit already integrated for scalable state management
- Vite proxy simplifies local API integration
- reusable UI components are in place
- homepage composition is already driven by backend product data
- style organization suggests long-term structure instead of ad hoc growth

## Current Maturity Level

The frontend should be understood as:

- beyond a raw scaffold
- not yet a fully complete ecommerce client
- already structured enough to demonstrate architecture and state flow

What is implemented today:

- route shell
- homepage
- product fetching
- shared layout components
- loader and title helpers
- responsive navbar patterns
- homepage hero slider

What is still to be built or completed:

- dedicated product listing page
- product details page
- cart, shipping, payment, and order workflows
- real authenticated user state integration
- admin panels connected to backend APIs
- stronger error presentation and UX polish

## Development Setup

### Install dependencies

From the `frontend/` directory:

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

### Run linting

```bash
npm run lint
```

## Required Backend Assumption

The frontend currently assumes the backend is running locally at:

```text
http://127.0.0.1:8000
```

because Vite proxies `/api/*` requests there during development.

If the backend is not running, the homepage product fetch will fail.

## Dependency Notes

Key frontend dependencies and their roles:

- `react-router-dom`: routing
- `@reduxjs/toolkit`: Redux state management
- `react-redux`: React bindings for Redux
- `axios`: HTTP requests
- `@mui/icons-material`: iconography
- `@emotion/react` and `@emotion/styled`: required styling peer dependencies for Material UI
