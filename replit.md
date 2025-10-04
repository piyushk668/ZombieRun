# Jungle Run - Zombie Chase Game

## Overview

Jungle Run is a 3D endless runner game built with React Three Fiber where players navigate through obstacles while being chased by a zombie. The game features level-based progression, collectible gems, trap mini-games, and multiple screen flows including authentication, tutorials, and gameplay. The project uses a modern TypeScript stack with React for the frontend, Express for the backend, and PostgreSQL (via Neon) for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Rendering**
- React 18 with TypeScript for UI components and game logic
- React Three Fiber (@react-three/fiber) for 3D rendering using Three.js
- React Three Drei (@react-three/drei) for useful 3D helpers (KeyboardControls, useTexture, etc.)
- React Three Postprocessing for visual effects
- Vite as the build tool and development server with HMR support

**UI Component System**
- Radix UI primitives for accessible, unstyled components (dialogs, buttons, forms, etc.)
- Tailwind CSS for styling with custom theme configuration
- shadcn/ui component patterns for consistent design system
- Custom modal and screen components for game flow management

**State Management**
- Zustand for global state management with multiple stores:
  - `useGameState`: Manages game progression, player state, level data, and screen flow
  - `useAudio`: Controls background music and sound effects
  - `useGame`: Handles game phase transitions (ready/playing/ended)
- State is organized by domain concern with clear separation between game logic, audio, and UI state

**Game Architecture**
- Component-based 3D scene structure:
  - `Player`: Handles player physics, movement, and input
  - `Zombie`: AI-controlled enemy with chase logic
  - `Terrain`: Procedurally positioned ground segments
  - `Obstacles`: Collision-based trap system
  - `Gems`: Collectible items with rotation animations
- Keyboard controls using React Three Drei's KeyboardControls
- Physics simulation using useFrame hook for game loop
- Collision detection via custom utility functions

**Game Flow Screens**
- Welcome Screen: Entry point with background music and animated logo
- Auth Screen: Google login or guest play options
- Tutorial Screen: Multi-step interactive guide for game controls
- Game Scene: Main 3D gameplay with Canvas wrapper
- Game UI: HUD overlay showing score, gems, level, and controls
- Trap Mini-Game: Puzzle challenge triggered by obstacle collisions

### Backend Architecture

**Server Framework**
- Express.js running in ESM mode
- TypeScript for type safety
- Custom middleware for request logging and JSON response capture
- Vite integration for development mode with HMR
- Static file serving in production

**API Structure**
- REST API convention with `/api` prefix for all routes
- Routes defined in `server/routes.ts` using Express Router
- HTTP server creation using Node's native `http` module
- Error handling middleware for centralized error responses

**Storage Layer**
- Abstract `IStorage` interface defining CRUD operations
- `MemStorage`: In-memory implementation for development/testing
- Designed for easy swap to database-backed implementation
- Storage methods return Promises for async operations
- Current implementation includes user management (getUser, getUserByUsername, createUser)

### Data Storage Solutions

**Database**
- PostgreSQL via Neon serverless database (@neondatabase/serverless)
- Drizzle ORM for type-safe database queries and migrations
- Schema defined in `shared/schema.ts` for shared client/server types
- Database credentials configured via `DATABASE_URL` environment variable

**Schema Design**
- Users table with id, username, and password fields
- Drizzle-Zod integration for automatic validation schema generation
- Type inference for Insert and Select operations
- Serial primary keys with unique constraints

**Session Management**
- Express session support via connect-pg-simple (for PostgreSQL session store)
- Session data persisted to database for scalability

### External Dependencies

**3D Graphics & Game Engine**
- Three.js: Core 3D rendering library
- @react-three/fiber: React renderer for Three.js
- @react-three/drei: Helper components and utilities
- @react-three/postprocessing: Visual effects and shaders
- vite-plugin-glsl: GLSL shader support in Vite

**Database & ORM**
- @neondatabase/serverless: PostgreSQL database client
- Drizzle ORM (drizzle-orm): Type-safe database toolkit
- drizzle-kit: Migration tool and schema management
- connect-pg-simple: PostgreSQL session store

**UI Framework**
- Radix UI: Headless component primitives (20+ component packages)
- Tailwind CSS: Utility-first CSS framework
- class-variance-authority: Type-safe variant styling
- cmdk: Command palette component

**State & Data Fetching**
- Zustand: Lightweight state management
- @tanstack/react-query: Async state and server data synchronization

**Development Tools**
- Vite: Fast build tool with ESM support
- TypeScript: Type safety across client and server
- tsx: TypeScript execution for development
- esbuild: Fast JavaScript bundler for production
- @replit/vite-plugin-runtime-error-modal: Runtime error overlay

**Validation & Utilities**
- Zod: Schema validation library
- date-fns: Date manipulation utilities
- nanoid: Unique ID generation

**Asset Support**
- @fontsource/inter: Self-hosted Inter font family
- Support for GLTF/GLB 3D models
- Audio file formats: MP3, OGG, WAV
- Texture loading via React Three Drei