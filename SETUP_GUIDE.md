# D&D Campaign Manager - Complete Setup Guide

## Overview

You now have a full-stack D&D campaign management system with:

1. **SQL Database Schema** (`schema.sql`) - Defines all tables and relationships
2. **Frontend** - React + TypeScript web application with components for managing NPCs, Characters, and Quests
3. **Backend Framework** - Express.js API ready for implementation
4. **Type System** - Full TypeScript types for all database entities

## File Locations

### Database
- **Schema Definition**: `schema.sql`
- Purpose: PostgreSQL database setup with all tables, foreign keys, and indexes

### Frontend
- **Main App**: `dnd-project/src/App.tsx`
- **Components**: `dnd-project/src/components/` (NPCsList, CharactersList, QuestsList)
- **API Service**: `dnd-project/src/services/api.ts` (REST client)
- **Type Definitions**: `dnd-project/src/types/index.ts`
- **Styles**: `dnd-project/src/styles/entities.css` and `dnd-project/src/App.css`
- **Setup Guide**: `dnd-project/FRONTEND_SETUP.md`

### Backend
- **Entry Point**: `dnd-project/server/index.ts` (needs implementation)
- **Configuration**: `dnd-project/package.json` (dependencies included)

## Quick Start

### 1. Database Setup

If using PostgreSQL:

```bash
# Create database
createdb dnd_campaign_manager

# Load schema
psql dnd_campaign_manager < schema.sql
```

### 2. Install Dependencies

```bash
cd dnd-project
npm install
```

### 3. Run Full Stack

```bash
npm run dev:full
```

This starts:
- Frontend on `http://localhost:5173`
- Backend on `http://localhost:3001`

### 4. Build for Production

```bash
npm run build           # Build both frontend and backend
npm run build:server    # Build server only
npm run start:api:prod  # Run production API
```

## Next Steps

### Backend Development

The `server/index.ts` file needs to implement these endpoints:

1. **User Management** - CRUD operations for users and roles
2. **Character Management** - Link to users and campaigns
3. **Quest System** - Create and manage quests with steps
4. **NPC Management** - Store and retrieve NPCs
5. **Item System** - Manage items and quest rewards

### Recommended Backend Libraries

```bash
npm install pg                    # PostgreSQL driver
npm install express-validator     # Input validation
npm install cors                  # CORS middleware (already installed)
```

### Database Connection Example

```typescript
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost/dnd_campaign_manager'
});

// Use pool.query() for database operations
```

## Architecture

```
┌─────────────────────────────────────────┐
│         React Frontend (5173)           │
│  ┌───────────────────────────────────┐  │
│  │  App.tsx (Navigation & Pages)     │  │
│  │  ├─ NPCsList Component            │  │
│  │  ├─ CharactersList Component      │  │
│  │  └─ QuestsList Component          │  │
│  └───────────────────────────────────┘  │
│              ↓ HTTP REST ↓               │
│        api.ts (REST Client)              │
└─────────────────────────────────────────┘
           ↓ Fetch calls ↓
┌─────────────────────────────────────────┐
│  Express.js Backend API (3001)          │
│  ┌───────────────────────────────────┐  │
│  │  server/index.ts                  │  │
│  │  ├─ /api/users endpoints          │  │
│  │  ├─ /api/characters endpoints     │  │
│  │  ├─ /api/quests endpoints         │  │
│  │  ├─ /api/npcs endpoints           │  │
│  │  └─ /api/items endpoints          │  │
│  └───────────────────────────────────┘  │
│              ↓ SQL queries ↓             │
└─────────────────────────────────────────┘
           ↓ Connection String ↓
┌─────────────────────────────────────────┐
│     PostgreSQL Database                 │
│  ┌───────────────────────────────────┐  │
│  │  Tables:                          │  │
│  │  ├─ Users & Roles                 │  │
│  │  ├─ Characters & Campaigns        │  │
│  │  ├─ Quests & Quest Steps          │  │
│  │  ├─ NPCs & NPC Comments           │  │
│  │  ├─ Items & Quest Rewards         │  │
│  │  └─ Notes & Secrets               │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## Database Relationships

```
Roles (1) ──→ (many) Users
       ↓
Users (1) ──→ (many) Characters
        ↓
     (1) ──→ (many) Character_Secrets
        ↓
     (1) ──→ (many) QuestNotes
        ↓
     (1) ──→ (many) NPC_Comments

Quest (1) ──→ (many) Quest_Steps
        ↓
     (1) ──→ (many) QuetsNotes

Quest_Step (1) ──→ (many) Quest_Rewards
        ↓
     (many) ──→ (1) Items

NPC (1) ──→ (many) NPC_Comments
```

## Available npm Scripts

```bash
npm run dev           # Start frontend dev server
npm run dev:api       # Start backend with file watching
npm run dev:full      # Start both frontend and backend
npm run build         # Build both for production
npm run build:server  # Build backend TypeScript
npm run start:api     # Run backend with tsx
npm run start:api:prod # Run built/compiled backend
npm run lint          # Run ESLint
npm run preview       # Preview production build
```

## Environment Variables

Create a `.env` file in the project root:

```env
# Backend
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost/dnd_campaign_manager

# Frontend
VITE_API_URL=http://localhost:3001
```

## Troubleshooting

### Frontend won't connect to API
- Check that backend is running on port 3001
- Verify vite.config.ts has correct proxy settings (`/api` → `http://localhost:3001`)
- Check browser console for network errors

### Database connection errors
- Ensure PostgreSQL is running
- Verify database name and credentials
- Check schema.sql was loaded successfully

### TypeScript errors
- Run `npm run build` to see all errors
- Check that types in `src/types/index.ts` match backend responses

## Features to Add Later

1. **Authentication** - User login/register
2. **Permissions** - Role-based access control
3. **Real-time Updates** - WebSocket for collaborative editing
4. **Search** - Find NPCs, quests, characters
5. **Bulk Operations** - Import/export data
6. **Campaign Maps** - Visualize campaign worlds
7. **Character Sheets** - Full D&D character details
8. **Dice Roller** - Built-in D&D dice
9. **Campaign Timeline** - Track quest progression
10. **Media Management** - Upload images for NPCs, items, etc.

## Support Resources

- React: https://react.dev
- TypeScript: https://www.typescriptlang.org
- Express.js: https://expressjs.com
- PostgreSQL: https://www.postgresql.org
- Vite: https://vitejs.dev

---

**Your D&D Campaign Manager is ready to customize!** 🐉
