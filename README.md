# Email Campaign Management System

A full-stack application that lets a marketing user create bulk email campaigns,
submit a list of recipients, queue individual emails, process them asynchronously,
and view campaign and per-recipient statuses.

**Architecture:** Angular front-end → Laravel API → MySQL → Queue/Worker

---

## Stack

| Layer    | Technology                                                                                                                                     |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Backend  | Laravel 13, PHP 8.3+, MySQL, Laravel Queue (database driver), PHPUnit                                                                          |
| Frontend | Angular 19 (standalone components), TypeScript (strict), SCSS + Bootstrap 5 (grid + utilities only, no Bootstrap JS), Jasmine/Karma, Storybook |

## Features

- Create a campaign with a name, subject, body and a list of recipients.
- Server-side validation (required fields, length limits, valid and unique emails).
- Campaign + email jobs are persisted atomically in a database transaction.
- One queued job per recipient, processed asynchronously in FIFO order.
- Simulated email sending (no external mail provider is required).
- Campaign status flows `queued → processing → done`; each email job is `pending → sent | failed`.
- Angular UI: campaign creation form with a live email preview, campaign list, and campaign details.
- PHPUnit (backend) and Karma/Jasmine (frontend) test suites; Storybook for shared components.

---

## Requirements

- PHP **8.3+**
- Composer
- MySQL **8**
- Node.js **20+** and npm

## Setup

### 1. Backend

```bash
composer install
cp .env.example .env
php artisan key:generate
```

Edit `.env` with your database credentials:

```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=email_campaign_management_system
DB_USERNAME=root
DB_PASSWORD=
```

Create the schema (and optionally seed sample campaigns):

```bash
php artisan migrate
php artisan db:seed
```

### 2. Frontend

```bash
cd frontend
npm install
```

---

## Running the application

Open three terminals and run:

```bash
# Terminal 1 — Laravel API (http://localhost:8000)
php artisan serve

# Terminal 2 — queue worker (processes the queued email jobs)
php artisan queue:work

# Terminal 3 — Angular dev server (http://localhost:4200)
cd frontend
npm start
```

Open **http://localhost:4200** in your browser.

The Angular dev server proxies `/api` requests to `http://localhost:8000`
(see `frontend/src/proxy.conf.json`), so no CORS setup is needed in development.
The queue uses the `database` driver (`QUEUE_CONNECTION=database` in `.env`).

---

## API

### `POST /api/campaigns`

Creates a campaign and queues one email job per recipient.

Request:

```json
{
    "name": "Spring Sale",
    "subject": "50% Off This Weekend!",
    "body": "Check out our amazing deals...",
    "recipient_emails": ["email1@test.com", "email2@test.com"]
}
```

Response (`201 Created`):

```json
{
    "campaign_id": 1,
    "recipient_count": 2,
    "status": "queued"
}
```

Validation failure (`422 Unprocessable Entity`):

```json
{
    "error": "Invalid input",
    "details": {
        "subject": "The subject field is required.",
        "recipient_emails.0": "The recipient_emails.0 field must be a valid email address."
    }
}
```

### `GET /api/campaigns`

Returns a paginated list of campaigns (15 per page), ordered newest first.

```json
{
    "data": [
        {
            "id": 1,
            "name": "Spring Sale",
            "subject": "50% Off This Weekend!",
            "recipient_count": 25,
            "status": "processing",
            "created_at": "2026-10-08T10:30:00.000000Z"
        }
    ],
    "links": { "first": "...", "last": "...", "prev": null, "next": "..." },
    "meta": { "current_page": 1, "last_page": 1, "per_page": 15, "total": 1 }
}
```

### `GET /api/campaigns/{id}`

Returns a single campaign with its email jobs and per-recipient statuses.

```json
{
    "id": 1,
    "name": "Spring Sale",
    "subject": "50% Off This Weekend!",
    "body": "Check out our amazing deals...",
    "recipient_count": 3,
    "status": "processing",
    "created_at": "2026-10-08T10:30:00.000000Z",
    "email_jobs": [
        {
            "id": 1,
            "recipient_email": "john@test.com",
            "status": "sent",
            "created_at": "..."
        },
        {
            "id": 2,
            "recipient_email": "mary@test.com",
            "status": "sent",
            "created_at": "..."
        },
        {
            "id": 3,
            "recipient_email": "peter@test.com",
            "status": "pending",
            "created_at": "..."
        }
    ]
}
```

---

## Running the tests

```bash
# Backend — PHPUnit (12 tests)
php artisan test

# Frontend — Karma/Jasmine (16 tests, headless)
cd frontend
npm test -- --watch=false --browsers=ChromeHeadless
```

## Storybook

```bash
cd frontend
npm run storybook          # dev server at http://localhost:6006
npm run build-storybook    # static build → frontend/storybook-static
```

---

## Assumptions & decisions

- **Email sending is simulated.** The queue job logs "Email sent successfully" rather than
  contacting a real mail provider, as permitted by the brief.
- **One queue job per recipient.** This gives better failure isolation than a single job that
  loops over recipients, and lets Laravel's retry/backoff apply per recipient.
- **Campaign "done" semantics.** A campaign becomes `done` when no `pending` email jobs remain,
  even if some jobs `failed`. The brief only defines `queued | processing | done`, so there is no
  distinct "failed" campaign status.
- **FIFO ordering.** Jobs are dispatched in recipient order; with a single `queue:work` process
  they are processed in FIFO order. Multiple workers do not guarantee ordering.
- **Recipients input.** Recipients are entered one email per line in a textarea (the brief's first
  suggested option).
- **Validation error shape.** The API returns the first validation message per field as a string
  under `details`, e.g. `"subject": "The subject field is required."`.
- **Pagination.** `GET /api/campaigns` is paginated (15/page) and returns a
  `{ data, links, meta }` envelope.
- **Frontend conventions.** Angular 19 standalone components, Reactive Forms, and Signals for
  component state. Bootstrap 5's grid + utility classes are used; a small set of custom component
  classes (`.btn`, `.alert`, `.table`, `.form-control`, etc.) is defined in
  `frontend/src/styles.scss`.
- **Storybook.** Version 8.6 is used (`@storybook/angular`). Auto-generated Docs pages
  (`autodocs`/`addon-docs`) are disabled because `compodoc@0.0.41` is incompatible with Node 22;
  the maintained `@compodoc/compodoc` is installed so Storybook builds, and component stories are
  provided for the shared components.
- **Email template builder.** The "email template builder" described in Section 2 of the brief
  (compose templates from Header/Text/Image/Button blocks) was intentionally **not** implemented —
  see below.

## Not implemented / incomplete

- **No real email delivery** — sending is simulated only, as specified.
- **No authentication on the campaign API** — not required by the brief.
- **Email template builder (Section 2)** — scoped out. It conflicts with Tasks 7–10 and the API
  stores the body as a plain-text string. A simpler live email preview (subject + body) is
  included in the create form instead.
- **Storybook auto-generated docs pages** — disabled (compodoc/Node 22 issue noted above).

## Secrets

A sample `.env.example` is included with placeholder values only. No passwords, API keys or other
secrets are committed to the repository (`.env` is git-ignored).
