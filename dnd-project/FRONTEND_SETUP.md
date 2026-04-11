# D&D Campaign Manager - Frontend Setup

## Project Structure

The frontend is a React + TypeScript application built with Vite, designed to work with the SQL backend API.

```
src/
├── components/          # React components
│   ├── NPCsList.tsx    # NPC management UI
│   ├── CharactersList.tsx # Character management UI
│   └── QuestsList.tsx   # Quest management UI
├── services/           # API integration layer
│   └── api.ts         # REST API client for all endpoints
├── styles/            # Component-specific styles
│   └── entities.css   # Styles for entity list components
├── types/             # TypeScript type definitions
│   └── index.ts       # All database entity types
├── App.tsx            # Main app component with navigation
├── App.css            # App-level styles
├── index.css          # Global styles
└── main.tsx           # React entry point
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

Run both frontend and backend together:

```bash
npm run dev:full
```

This runs:
- **Frontend**: Vite dev server on `http://localhost:5173`
- **Backend**: Express API on `http://localhost:3001`

Or run them separately:

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
npm run dev:api
```

### 3. Build for Production

```bash
npm run build
```

## Frontend Features

### Components

#### NPCsList
- Display all NPCs
- Create new NPCs with name and description
- Delete NPCs
- Shows NPC images if available

#### CharactersList
- Display all player characters
- Create characters linked to users and campaigns
- Associate characters with campaigns (optional)
- Add character notes
- Delete characters

#### QuestsList
- Display all quests
- Create new quests
- Delete quests
- Shows creation date for each quest

### API Service Layer

The `src/services/api.ts` file provides typed API clients for all database entities:

```typescript
// Example usage
import { npcsAPI, questsAPI } from './services/api';

// Get all NPCs
const npcs = await npcsAPI.getAll();

// Create a new quest
const quest = await questsAPI.create({ name: 'Rescue the Princess' });

// Delete an NPC
await npcsAPI.delete(npcId);
```

### API Endpoints Expected

The frontend expects the following REST endpoints on the backend:

```
Users:
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id

Characters:
GET    /api/characters
GET    /api/characters/:id
GET    /api/characters?user_id=:userId
POST   /api/characters
PUT    /api/characters/:id
DELETE /api/characters/:id

Campaigns:
GET    /api/campaigns
GET    /api/campaigns/:id
POST   /api/campaigns

Quests:
GET    /api/quests
GET    /api/quests/:id
POST   /api/quests
PUT    /api/quests/:id
DELETE /api/quests/:id

Quest Steps:
GET    /api/quests/:questId/steps
POST   /api/quests/:questId/steps
PUT    /api/quests/:questId/steps/:stepId
DELETE /api/quests/:questId/steps/:stepId

NPCs:
GET    /api/npcs
GET    /api/npcs/:id
POST   /api/npcs
PUT    /api/npcs/:id
DELETE /api/npcs/:id

Items:
GET    /api/items
GET    /api/items/:id
POST   /api/items
PUT    /api/items/:id
DELETE /api/items/:id

Health Check:
GET    /api/health → { ok: true, service: 'dnd-project-api' }
```

## Type System

TypeScript types are defined in `src/types/index.ts`:

- `User` - Player/DM users
- `Character` - Player characters in campaigns
- `Campaign` - Campaign/world definitions
- `Quest` - Main quest objects
- `QuestStep` - Individual quest steps
- `NPC` - Non-player characters
- `Item` - Quest rewards and inventory items
- `Role` - User role/permission levels
- And more...

## Styling

The app uses custom CSS for theming with a D&D-inspired color palette:

- Primary: `#d4a574` (bronze/gold)
- Dark: `#2c1810` (dark brown)
- Background: `#f9f7f4` (cream)
- Light text: `#f4e4c1` (parchment)

Responsive design with mobile breakpoints at 768px.

## Next Steps for Backend Integration

You'll need to implement Express endpoints that:

1. **Connect to PostgreSQL database** using the schema from `schema.sql`
2. **Implement CRUD endpoints** for all entities
3. **Add validation and error handling**
4. **Add authentication/authorization** (optional, use roles)
5. **Add database migrations** (consider Knex.js or similar)

### Backend Stack Suggestion

```bash
npm install pg express-validator
# OR
npm install mongoose  # if using MongoDB instead
```

## Development Tips

- Keep API service functions clean and typed
- Use component state for UI state only (forms, loading states)
- API errors are caught and displayed in error messages
- Check the "API Connected" indicator in the navbar
- Add more components following the NPCsList/CharactersList pattern
