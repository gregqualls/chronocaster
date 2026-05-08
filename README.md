# ChronoCaster

A live-event control room for podcasts, webinars, and broadcast productions. One person (the producer/director) drives the rundown clock; everyone else — hosts, crew, viewers, lobby monitors — sees the same countdown, segment, and schedule pace in real time.

> **Status:** working v1. Cross-client sync uses HTTP polling (~2s convergence). WebSocket transport (Reverb) is the planned upgrade.

> [!WARNING]
> **This is a demo project, not a production app.** A few things to fix before pointing real users at it:
> - The seed creates a `Super Admin` with hardcoded creds (`admin@chronocaster.local` / `chronocaster`). Set `DEMO_ADMIN_PASSWORD` (and ideally `DEMO_ADMIN_EMAIL`) to your own values before the first deploy, or remove the `DemoSeeder::seedAdminUser()` call entirely and create your own user.
> - There is no "change password" or "forgot password" UI; password changes go through tinker / a seeder run today.
> - The control buttons (Pause / Resume / Advance / End) are visible to everyone authenticated. The server-side permission (`control_live_event`) is enforced, but the UI doesn't yet hide the buttons from non-Directors.
> - There is no rate limiting, audit log, or proper account management beyond what Laravel ships with.
> - Cross-client sync is HTTP polling — fine for a few clients, not fine for hundreds. See the *What's not built* section.

## What it does

- **Schedule view** — list of upcoming, ready, and recent events with status chips (DRAFT / SCHEDULED / READY / LIVE / PAUSED / COMPLETED).
- **Pre-show** — countdown to scheduled start, crew list, studios-connected status, GO LIVE button.
- **Live control room** — hero countdown for the active segment, pause / resume / advance / stop, full rundown with LIVE/NEXT/done states.
- **Schedule pace** — live `+/-MM:SS` indicator showing how far ahead or over plan the show is running.
- **Public viewer link** — one-click copy of a `/watch/<token>` URL anyone can open (no login) to see the live timeline. Used for talent green-rooms, lobby countdown screens, audience-side displays.
- **Programs library** — reusable show templates that own their default duration and recurrence cadence.

## Architecture

Two apps in one repo, deployed together on [Upsun](https://upsun.com).

```
chronocaster/
├── chronocaster-backend/        # Laravel 11 (PHP 8.3) + MariaDB
├── chronocaster-frontend/       # CRA (React 18) + MUI dark theme + Express proxy
└── .upsun/config.yaml           # Both apps + db service + relationships + routes
```

- **Frontend** (`chronocaster-frontend`)
  - Static SPA built by `react-scripts` and served by `server.js`, an Express process that also proxies `/api/*` to the backend over Upsun's internal `backend` relationship. **The backend has no public route** — it's only reachable via the proxy.
  - Auth: Laravel session cookie, attached automatically by `axios` (`withCredentials: true`).
- **Backend** (`chronocaster-backend`)
  - Laravel 11, MariaDB 11.8 via the `db` Upsun relationship.
  - Built-in session auth (no Auth0 / Sanctum). Session middleware is applied to the `api` group; CSRF is excluded for `/api/*` (same-origin + custom XHR header).
  - Spatie permissions: `Super Admin`, `Org Admin`, `Director`, `Host`, `Viewer` roles seeded by `DatabaseSeeder`.

### Domain model

```
Program  ──< Unit (an event) ──< Segment (rundown row)
              │
              └── unit_user pivot (crew assignments with role)
```

- `Unit` carries the live state: `status`, `started_at`, `current_segment_id`, `current_segment_started_at`, `paused_at`, `share_token`.
- The frontend computes elapsed time locally between polls using `current_segment_started_at`, so the timer ticks smoothly even on a 2-second poll interval.

## Local development

### Frontend

```sh
cd chronocaster-frontend
npm install
npm start                        # CRA dev server on :3000
```

Without a backend reachable, the app uses the mock data in `src/data/events.js` and `ProtectedRoute` will redirect to `/login`. To exercise the full app, run the backend too:

### Backend

```sh
cd chronocaster-backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed       # seeds the demo admin + demo events
php artisan serve                # :8000
```

Add `REACT_APP_API_URL=http://localhost:8000/api` to `chronocaster-frontend/.env.local` if you want the SPA dev server to hit your local Laravel directly.

### Default credentials

The seeder creates a single `Super Admin` user from env vars (or hardcoded defaults):

| Variable | Default |
|---|---|
| `DEMO_ADMIN_EMAIL` | `admin@chronocaster.local` |
| `DEMO_ADMIN_PASSWORD` | `chronocaster` |

Override either before the first deploy/seed if you want different starter creds.

## Deploying to Upsun

The project is wired for [Upsun](https://upsun.com); pushing to GitHub is the deploy.

```sh
upsun login
git push origin main             # production
git push origin <branch>         # auto-creates a preview environment
```

Both apps build, the frontend proxies `/api` to the backend over the internal relationship, and on every deploy the backend hook runs:

```yaml
# .upsun/config.yaml (excerpt)
deploy: |
  rm -f bootstrap/cache/*.php
  php artisan package:discover --ansi
  php artisan migrate --force
  php artisan db:seed --force
  php artisan optimize
```

The cache nuke on the first line is intentional — the `bootstrap/cache` mount uses a `tmp` source that persists across deploys, so stale `packages.php` from a prior set of dependencies will break boot if not cleared.

## Producer / viewer flow

1. **Producer signs in** → lands on the schedule.
2. Click an event card → **pre-show view** with countdown to scheduled start.
3. Click **Copy viewer link** in the header to grab the public `/watch/<token>` URL. Send it to anyone who needs to *see* the show but doesn't drive it (talent monitors, lobby screens, the audience).
4. Click **GO LIVE** when ready — the live control room takes over.
5. **Pause / Resume / Advance / End** drive the rundown. The Schedule Pace card on the right reads `+M:SS` (ahead of plan) or `-M:SS` (over) so the producer always knows how the show is running vs the rundown's planned durations.
6. Anyone holding the `/watch/<token>` link sees the same hero countdown, current segment, show-remaining, and schedule pace — refreshed every 2 seconds. No emails or crew details leak.

## What's not built (yet)

- **Real-time WebSocket transport.** Cross-client sync today is HTTP polling at 2s. The next step is a Reverb worker on Upsun behind a `wss://` route so updates land within ~50ms instead of ~2s.
- **Role-based UI gating.** Server-side permissions are wired (`control_live_event`), but the SPA shows the producer controls to anyone who can see the event. Planned: only Director sees Pause/Resume/Advance/End; Host gets a read-only mirror with an "I'm ready" ack; Viewer gets the same as `/watch`.
- **Recurring event templates** and external calendar (Google / iCal) integration.
- **Reverb / Redis** as Upsun services for the WebSocket upgrade.

See `.claude/plans/ok-it-s-up-and-gentle-pelican.md` for the full roadmap.

## Tech stack

- **Backend:** Laravel 11, PHP 8.3, MariaDB 11.8, Spatie laravel-permission
- **Frontend:** React 18, CRA, Material UI 5 (custom dark broadcast theme), `axios`, `react-router-dom`, `http-proxy-middleware`
- **Hosting:** Upsun (frontend `nodejs:24` + backend `php:8.3` + MariaDB service, single public route exposed via the frontend Express server)

## License

MIT — see [LICENSE](LICENSE).
