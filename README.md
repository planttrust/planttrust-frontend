# PlanTrust — Frontend

The Next.js frontend for [PlanTrust](https://github.com/planttrust/planttrust-backend), a blockchain-based land investment platform built on the XRPL Testnet.

## Architecture

This is the **frontend repo**. The backend lives in a separate repository: [`planttrust-backend`](https://github.com/planttrust/planttrust-backend).

The frontend is a single Next.js app shared across all five modules. Each module owner builds their pages within the app router:

| Route | Module | Owner |
|---|---|---|
| `/auth` | M1 — User Management | Nimsara Karunarathna |
| `/marketplace` | M2 — Investor Marketplace | Thilina Dasun |
| `/chatbot` | M3 — MCP-Driven AI | Imesha Ariyawansha |
| `/company` | M4 — Company Portal | Yasuri Pradeepika |
| `/dashboard` | M5 — Blockchain Audit | Mirath Nimsara |

## Project Structure

```
planttrust-frontend/
├── src/
│   ├── app/
│   │   ├── auth/           # M1 pages (Nimsara)
│   │   ├── marketplace/    # M2 pages (Thilina)
│   │   ├── chatbot/        # M3 pages (Imesha)
│   │   ├── company/        # M4 pages (Yasuri)
│   │   ├── dashboard/      # M5 pages (Mirath)
│   │   ├── layout.js       # Root layout
│   │   ├── page.js         # Landing page
│   │   └── globals.css     # Global styles
│   ├── components/         # Shared UI: Navbar, Footer, etc.
│   └── lib/                # API client config
├── public/                 # Static assets
├── .env.example            # Environment variable template
├── Dockerfile              # Container build
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+ (see `.nvmrc`)
- The backend services running (see [`planttrust-backend`](https://github.com/planttrust/planttrust-backend))

### Local Development

```bash
# Install dependencies
npm install

# Copy environment config
cp .env.example .env.local

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### With Docker

```bash
docker build -t planttrust-frontend .
docker run -p 3000:3000 planttrust-frontend
```

Or use the `docker-compose.yml` in the backend repo to start everything together.

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_MODULE1_URL` | User Management API | `http://localhost:3001` |
| `NEXT_PUBLIC_MODULE2_URL` | Marketplace API | `http://localhost:3002` |
| `NEXT_PUBLIC_MODULE3_URL` | AI/MCP API | `http://localhost:3003` |
| `NEXT_PUBLIC_MODULE4_URL` | Geofencing API | `http://localhost:3004` |
| `NEXT_PUBLIC_MODULE5_URL` | Blockchain Audit API | `http://localhost:3005` |

## API Contracts

The frontend calls each backend module's REST API. See `contracts/` in the [`planttrust-backend`](https://github.com/planttrust/planttrust-backend) repo for the full interface specs.

## Branching Model

- `main` — stable, demo-ready
- `develop` — shared integration baseline
- `feature/<module>/<ticket-name>` — one branch per issue, targets `develop`

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

