# Mystery Solvers - Family Detective Game

## Overview

Mystery Solvers is a family-friendly detective game built as a full-stack web application. The game allows families to work together as a team, selecting unique characters with special abilities to solve interactive mysteries through step-by-step gameplay. The application features a modern React frontend with a Node.js/Express backend, using PostgreSQL for data persistence.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: Radix UI with shadcn/ui component library
- **Styling**: Tailwind CSS with custom Mystery Solvers theme colors
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Style**: RESTful API endpoints
- **Database Access**: Drizzle ORM with PostgreSQL
- **Session Management**: PostgreSQL-backed sessions (connect-pg-simple)

### Data Storage
- **Database**: PostgreSQL via Neon Database serverless
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Shared schema definitions between frontend and backend
- **Migrations**: Drizzle Kit for database schema management

## Key Components

### Database Schema
The application uses four main tables:
- **Characters**: Game characters with unique abilities and visual properties
- **Mysteries**: Puzzle scenarios with difficulty levels and age ranges
- **Families**: Player groups with scoring and progress tracking
- **GameSessions**: Active game state management linking families to mysteries

### API Endpoints
- `/api/characters` - Character management (GET, POST)
- `/api/mysteries` - Mystery scenarios (GET, POST)
- `/api/families` - Family team management
- `/api/game-sessions` - Game state tracking

### Frontend Pages
- **Home**: Landing page with game overview and character/mystery showcases
- **Game**: Interactive gameplay interface with step-by-step mystery solving
- **Leaderboard**: Family scoring and competition tracking
- **Character Selection**: Choose team members with unique abilities

### Game Logic
- Step-based mystery progression with character-specific requirements
- Collaborative gameplay encouraging family participation
- Scoring system based on mystery completion and difficulty
- Visual feedback and progress tracking throughout gameplay

## Data Flow

1. **Game Initialization**: Players select characters and mysteries from the database
2. **Session Creation**: Game session is created linking family, mystery, and selected characters
3. **Step Progression**: Each mystery step requires specific character abilities to unlock
4. **Clue Discovery**: Players collect clues that are stored in the game session
5. **Completion Tracking**: Progress is saved to enable resume functionality
6. **Scoring**: Family scores are updated upon successful mystery completion

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless database connection
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Headless UI components for accessibility
- **drizzle-orm**: Type-safe database ORM
- **express**: Web application framework
- **react**: Frontend framework
- **tailwindcss**: Utility-first CSS framework
- **typescript**: Type safety and development experience
- **vite**: Fast build tool and development server
- **wouter**: Lightweight React router

### Development Tools
- **drizzle-kit**: Database schema management
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Development Environment
- **Frontend**: Vite development server with HMR
- **Backend**: Node.js with tsx for TypeScript execution
- **Database**: Connection to Neon Database via DATABASE_URL environment variable

### Production Build
- **Frontend**: Vite production build generating static assets
- **Backend**: esbuild bundling server code for Node.js deployment
- **Database**: Drizzle migrations applied via `db:push` command

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Development/production mode switching via `NODE_ENV`
- Replit-specific optimizations for cloud deployment

## Changelog

```
Changelog:
- July 03, 2025. Initial setup
- July 04, 2025. Created modern menu page with category filtering, equal height cards, and glassmorphism design
- July 04, 2025. Added restaurant logo to navigation and removed order functionality
- July 04, 2025. Created testimonials page with customer reviews, ratings, and statistics
- July 04, 2025. Created contact page with contact form and business information
- July 04, 2025. Added mobile navbar with sliding panel for all pages
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```