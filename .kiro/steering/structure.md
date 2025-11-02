# Project Structure

## Directory Organization

```
tech-tok/
├── src/                      # Application source code
│   ├── app/                  # Next.js App Router pages
│   │   ├── page.tsx          # Home page (main feed)
│   │   ├── layout.tsx        # Root layout
│   │   ├── globals.css       # Global styles
│   │   ├── login/            # Login page
│   │   ├── profile/          # Profile page
│   │   └── demo/             # Demo pages
│   ├── components/           # Shared UI components
│   │   ├── ui/               # Shadcn UI components (button, card, etc.)
│   │   └── *.stories.tsx     # Storybook stories
│   ├── features/             # Feature-based modules
│   │   ├── auth/             # Authentication feature
│   │   ├── feed/             # Feed feature
│   │   └── profile/          # Profile feature
│   ├── lib/                  # Utilities and configurations
│   │   ├── auth.ts           # Auth.js configuration
│   │   ├── auth.config.ts    # Auth.js config details
│   │   └── utils.ts          # Utility functions (cn helper)
│   └── types/                # Global TypeScript types
├── prisma/                   # Database layer
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Seed data script
├── docs/                     # Documentation
├── scripts/                  # Utility scripts
├── public/                   # Static assets
├── .storybook/               # Storybook configuration
└── docker-compose.yaml       # Local PostgreSQL setup
```

## Feature Module Structure

Each feature follows a consistent structure:

```
src/features/{feature-name}/
├── components/               # Feature-specific components
│   ├── component.tsx         # Component implementation
│   └── component.stories.tsx # Storybook story
├── hooks/                    # Feature-specific hooks
├── data/                     # Mock/sample data
└── types/                    # Feature-specific types
```

Example: `src/features/feed/`
- `components/` - feed-item, feed-actions, vertical-scroll-feed
- `hooks/` - Custom hooks for feed logic
- `data/` - Sample feed data for development
- `types/` - FeedItemData, FeedItemProps interfaces

## Component Conventions

### UI Components (`src/components/ui/`)
- Shadcn UI components with Radix UI primitives
- Use `cva` (class-variance-authority) for variants
- Export both component and variant types
- Always include Storybook stories
- Use `cn()` utility for className merging

### Feature Components (`src/features/*/components/`)
- Feature-specific, not globally reusable
- Co-located with related hooks, types, and data
- Include Storybook stories with mocked data
- Use TypeScript interfaces from feature's `types/` folder

## Naming Conventions

### Files
- Components: `kebab-case.tsx` (e.g., `feed-item.tsx`)
- Stories: `kebab-case.stories.tsx`
- Types: `index.ts` or descriptive name
- Hooks: `use-{name}.ts`

### Components
- PascalCase for component names
- Descriptive, feature-prefixed when needed
- Example: `VerticalScrollFeed`, `FeedActions`

### Database
- snake_case for table and column names
- Prisma models use PascalCase
- `@map()` directive maps to snake_case in DB

## Import Aliases

Use `@/` alias for imports from `src/`:
```typescript
import { Button } from "@/components/ui/button"
import { FeedItemData } from "@/features/feed/types"
import { cn } from "@/lib/utils"
```

## Storybook Requirements

Every component must have a corresponding `.stories.tsx` file:
- Mock external dependencies (API calls, auth)
- Provide multiple variants/states
- Include interactive controls where applicable
- Use sample data from feature's `data/` folder

## Database Layer

### Prisma Schema Organization
- Auth.js tables (User, Account, VerificationToken)
- Application tables (Post, Like, Bookmark, Comment, Follow)
- RSS management (RssSource, RssEntry, RssFetchLog)
- Feed aggregation (FeedItem - combines RSS + Posts)
- Supporting tables (Hashtag, Technology, Notification)

### Prisma Client Usage
- Import from `@prisma/client`
- Use in Server Components or API routes
- Never expose in Client Components
- Use Prisma Studio for database inspection

## Authentication Flow

- Auth.js configuration in `src/lib/auth.ts`
- OAuth providers: Google, GitHub
- Session management via Auth.js
- Protected routes use `auth()` helper
- User data stored in Prisma database

## Styling Approach

- Tailwind utility classes (primary method)
- Component variants via `cva`
- Dark mode support built-in
- Responsive design with Tailwind breakpoints
- Custom animations via tw-animate-css
