# Restaurant-Mobile-Hub

White-label restaurant loyalty mobile app (Expo / React Native), demonstrated with "Amman Coffee House". Originally built on [Replit](https://replit.com/@aalobaidat/Restaurant-Mobile-Hub).

## Run in GitHub Codespaces
1. Code -> Codespaces -> Create codespace on `main`.
2. Dependencies install automatically and `pnpm dev` starts the app.
3. Open the forwarded port **8081** (Ports tab) to see the app in the browser.

## Run locally
Requires Node.js 20+ and pnpm 10 (`corepack enable`).

```bash
pnpm install
pnpm dev            # Expo web app on http://localhost:8081
```

Other commands:
- `pnpm --filter @workspace/mobile run start:local` — Expo dev server (scan QR with Expo Go on a phone)
- `pnpm dev:api` — Express API server (needs `DATABASE_URL` for Postgres; the mobile preview does not use it)
- `pnpm run typecheck` / `pnpm run build`

## Structure
- `artifacts/mobile` — Expo customer app (menu, cart, checkout demo, rewards, Arabic/English)
- `artifacts/api-server` — Express 5 API
- `artifacts/mockup-sandbox` — Vite component preview
- `lib/*` — OpenAPI spec, generated client/Zod schemas, Drizzle DB schema

Note: the original `pnpm --filter @workspace/mobile run dev` script depends on Replit-only environment variables and only works inside Replit.
