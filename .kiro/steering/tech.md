# Tech Stack

## Framework & Runtime
- **Next.js 15** with App Router
- **React 19** (latest)
- **TypeScript 5.9** (strict mode enabled)
- **Node.js 18+**

## Styling & UI
- **Tailwind CSS 4** with PostCSS
- **Shadcn UI** + **Radix UI** for components
- **class-variance-authority** for component variants
- **Lucide React** for icons
- **tw-animate-css** for animations

## Database & ORM
- **PostgreSQL** (via Docker for local development)
- **Prisma 6.14** as ORM
- **@prisma/extension-accelerate** for performance

## Authentication
- **Auth.js (NextAuth.js) 5.0** beta
- **@auth/prisma-adapter** for database integration
- OAuth providers: Google, GitHub

## Development Tools
- **Biome.js** for linting and formatting (replaces ESLint + Prettier)
- **Storybook 9** for component development
- **pnpm** as package manager
- **tsx** for running TypeScript scripts
- **Docker Compose** for local PostgreSQL

## Code Quality Rules (Biome)
- Tab indentation
- Double quotes for strings
- No unused imports (error)
- No barrel files (error)
- Organize imports automatically
- Self-closing elements enforced

## Common Commands

### Development
```bash
pnpm dev              # Start Next.js dev server (http://localhost:3000)
pnpm storybook        # Start Storybook (http://localhost:6006)
pnpm build            # Production build
pnpm start            # Start production server
```

### Database
```bash
pnpm db:push          # Push schema changes to database
pnpm db:seed          # Seed database with test data
pnpm db:reset         # Reset database and re-seed
pnpm db:studio        # Open Prisma Studio (http://localhost:5555)
```

### Code Quality
```bash
pnpm lint             # Run Biome linter with auto-fix
pnpm format           # Format code with Biome
```

### Docker
```bash
docker compose up -d  # Start PostgreSQL
docker compose down   # Stop PostgreSQL
docker compose ps     # Check container status
```

## Environment Variables
Required in `.env.local`:
- `DATABASE_URL` - PostgreSQL connection string
- `AUTH_SECRET` - NextAuth.js secret
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` - Google OAuth
- `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` - GitHub OAuth

## Deployment
- **Frontend**: Vercel (planned)
- **Database**: Supabase managed PostgreSQL (planned)
