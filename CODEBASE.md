# Sanitary E-commerce - System Architecture & Codebase Map

> **MANDATORY**: AI Agents must read this file to understand the project architecture and dependencies before implementing changes.

---

## 1. System Overview

- **`admin-web`**: React + Vite frontend for administrators (Dashboard, Products, Categories, Orders, Users, Reviews).
- **`customer-web`**: React + Vite frontend for end users (Storefront, Cart, Checkout, User Profile, Product Details).
- **`backend`**: Spring Boot 3 + Java 21 REST API server.
- **Database**: PostgreSQL 17.9 managed via Flyway migrations.

---

## 2. Directory Structure & File Dependencies

### 2.1 Backend (`/backend`)
- **Framework**: Spring Boot 3.4.1, Spring Security 6, Spring Data JPA
- **Database**: PostgreSQL
- **Migrations**: `src/main/resources/db/migration` (Flyway - NEVER modify old V* scripts, only append new ones).
- **Structure (Feature-based)**:
  - `config/`: Security, CORS, JWT, exceptions, caching configs.
  - `auth/`: Authentication logic, JWT generation, User entity.
  - `product/`: Product, Category, Brand entities, DTOs, Controllers, Services.
  - `order/`: Order, OrderItem, shipping logic.
  - `cart/`: Cart management.
  - `ai/`: Integration with Gemini API (`AIChatController`, `AIChatService`).

**Dependencies & Rules for Backend:**
- **DTOs**: Always use DTOs for requests/responses (e.g., `ProductRequest`, `ProductResponse`). Do not expose Entities directly unless explicitly requested for simple CRUD.
- **Flyway**: Any change to Entities requires a corresponding Flyway migration script (e.g. `V25__add_new_column.sql`).

### 2.2 Customer Web (`/customer-web`)
- **Tech Stack**: React 18, Vite, Zustand (State Management), React Router DOM, Axios.
- **Structure**:
  - `src/features/`: Feature-sliced directories (e.g., `products/`, `cart/`, `checkout/`, `auth/`). Each feature has its own `pages`, `components`, and `services`.
  - `src/components/`: Shared global UI components (Layout, Header, Footer, ChatWidget).
  - `src/store/`: Zustand stores (`useAuthStore`, `useCartStore`).
  - `src/services/`: Global API configurations (`api.js`).

**Dependencies & Rules for Customer Web:**
- **State**: Use Zustand (`useCartStore`, `useAuthStore`) for global state. Do not over-engineer context.
- **Styling**: Vanilla CSS in `index.css` or module CSS. Avoid adding Tailwind unless confirmed. Follow S-LIFE UI/UX principles (minimalist, premium).

### 2.3 Admin Web (`/admin-web`)
- **Tech Stack**: React 18, Vite, Ant Design (UI Library), React Router DOM, Axios.
- **Structure**:
  - `src/features/`: Feature-sliced directories (Dashboard, Products, Orders, Users, Reviews).
  - `src/components/`: Layouts, Sidebar, Header.
  - `src/services/`: API configuration (`api.js`).

**Dependencies & Rules for Admin Web:**
- **UI Kit**: Exclusively use **Ant Design (antd)** components (Table, Form, Modal, Button, message, notification). Do not build raw HTML components for admin interfaces.
- **State**: Local state `useState/useEffect` mostly suffices since Antd handles form states.

---

## 3. Communication Patterns

- **Authentication**: JWT Bearer Tokens. Stored in `localStorage` in frontends, passed in `Authorization` header via Axios interceptors.
- **Public vs Private Endpoints**:
  - Backend `PublicApiController` handles unauthenticated requests (e.g., `/api/public/products`).
  - Feature controllers (e.g., `/api/admin/products`) require roles (`ROLE_ADMIN`, `ROLE_USER`).

---

## 4. Development & Testing Rules

1. **Keep it Simple**: Avoid over-architecting. Do not introduce Redux, GraphQL, or complex design patterns without user approval.
2. **Consistency**: If modifying a component in a feature, check if similar components exist in other features to maintain consistency.
3. **Database Changes**: Always reflect backend JPA Entity changes in `Flyway` SQL migrations and vice-versa.
4. **AI/Agent Awareness**: Comply with `GEMINI.md` routing and checklist protocols before delivering code.
