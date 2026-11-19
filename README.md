# planttrust-frontend

The web app for **Plantrust**, a platform for blockchain-verified land investment. Investors explore and
fund GPS-checked land projects, companies register land and submit progress reports, admins review
documents, and regulators follow an on-chain audit trail.

Built with **Next.js 16** (App Router, TypeScript) and **Tailwind CSS 4**, following the Figma file
"Plantrust | Complete desktop & mobile prototype". The API is
[planttrust-backend](https://github.com/planttrust/planttrust-backend).

## Quick start

You need Node.js 24 and the backend running on <http://localhost:4000> (see its README). In PowerShell:

```powershell
Copy-Item .env.example .env.local   # your local settings (never committed)
npm install
npm run dev                         # http://localhost:3000
```

The home page links to each module's first screen. Each one shows "Backend connected" when the backend
is reachable. Set `NEXT_PUBLIC_USE_MOCKS=true` in `.env.local` to work without the backend.

## npm scripts

| Script                                    | What it does                                              |
| ----------------------------------------- | --------------------------------------------------------- |
| `npm run dev`                             | Starts the site and reloads it when you save a file       |
| `npm run lint`                            | Checks the code, including the module-boundary rule       |
| `npm run typecheck`                       | Generates Next.js route types, then checks all TypeScript |
| `npm run format` / `npm run format:check` | Formats the code / checks the formatting                  |
| `npm run build` / `npm start`             | Builds the production version / runs it                   |

## Docker (for the demo)

With the backend running on port 4000 (`npm run dev` or `docker compose --profile full up` in planttrust-backend):

```powershell
docker build -t planttrust-frontend .
docker run --rm -p 3000:3000 planttrust-frontend   # http://localhost:3000
```

The backend address is fixed when the image is built (it defaults to the host's port 4000). To use another
one: `docker build --build-arg BACKEND_URL=https://api.example.com -t planttrust-frontend .`

## Project structure

```text
src/
├── app/                   Next.js routes; pages stay thin and render module components
│   ├── layout.tsx         Nunito font, page colours, <AuthProvider> around every page
│   ├── globals.css        Figma design tokens (colours, text styles, radius) as Tailwind classes
│   └── (m1) … (m5)/       one route group per module; the brackets don't appear in the URL
├── modules/mX-name/       one folder per module
│   ├── api.ts             the module's backend calls (other modules may import)
│   ├── types.ts           data shapes copied from the backend contract (other modules may import)
│   ├── mocks.ts           mock data used until a backend route exists
│   └── components/        the module's screens and pieces
└── shared/
    ├── api/client.ts      apiRequest, ApiError, withMockFallback
    ├── auth/              AuthProvider + useAuth() (who is logged in)
    └── ui/                Button, Field (Figma components) and shared pieces
```

| Module                                  | Owner   | First screen        | Backend prefix     |
| --------------------------------------- | ------- | ------------------- | ------------------ |
| M1 User Management & Corporate Registry | Nimsara | `/login`            | `/api/users`       |
| M2 Investor Marketplace & Escrow        | Thilina | `/projects`         | `/api/marketplace` |
| M3 MCP AI & Scam Detection              | Imesha  | `/assistant`        | `/api/mcp-ai`      |
| M4 Company Portal & Geofencing          | Yasuri  | `/company/projects` | `/api/geofencing`  |
| M5 Blockchain Audit & Trust Index       | Mirath  | `/regulator`        | `/api/audit`       |

## How the frontend talks to the backend

- The browser calls `/api/...` on the frontend's own address. `next.config.ts` forwards those requests
  to the backend at `BACKEND_URL`, so the browser sees a single site.
- Login uses an **httpOnly cookie** set by the backend. Frontend code never handles the token: the
  browser sends the cookie automatically, and `useAuth()` asks `GET /api/users/me` who is logged in.
- Design values come from Figma: use classes like `bg-brand`, `text-ink`, `text-title`, `text-label`,
  `rounded-control` instead of raw colours or sizes.

## Working on the project

- How we work (branches, PRs, ClickUp IDs, team rules): [CONTRIBUTING.md](CONTRIBUTING.md)
- Plan and progress: [GitHub project board](https://github.com/orgs/planttrust/projects/1) and the ClickUp
  folder "PlantTrust Sprints (23 Nov – 31 Jan)"
