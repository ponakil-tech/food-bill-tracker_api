# food-bill-tracker

Simple Node.js/Express API to track food bills and expenses, backed by Postgres.

## Endpoints

| Method | Path              | Description               |
|--------|-------------------|----------------------------|
| GET    | /health           | Health check               |
| GET    | /api/bills        | List all bills             |
| GET    | /api/bills/summary| Totals grouped by category |
| GET    | /api/bills/:id    | Get a single bill          |
| POST   | /api/bills        | Create a bill               |
| PUT    | /api/bills/:id    | Update a bill               |
| DELETE | /api/bills/:id    | Delete a bill               |

### Create a bill — example body
```json
{
  "title": "Grocery run - Whole Foods",
  "amount": 84.50,
  "category": "groceries",
  "bill_date": "2026-07-02",
  "notes": "Weekly stock up"
}
```

## Local setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your Postgres connection string
   (works with Supabase, Neon, Fly Postgres, or any Postgres instance):
   ```bash
   cp .env.example .env
   ```

3. Create the table — run the schema against your database:
   ```bash
   psql "$DATABASE_URL" -f src/db/schema.sql
   ```

4. Run the dev server:
   ```bash
   npm run dev
   ```
   API will be live at `http://localhost:8080`.

## Deploy to Fly.io

1. Install the Fly CLI and log in:
   ```bash
   curl -L https://fly.io/install.sh | sh
   fly auth login
   ```

2. Launch (first time only — this reads the existing `fly.toml`/`Dockerfile`,
   so answer "no" if it asks to overwrite them):
   ```bash
   fly launch
   ```

3. Set your database connection string as a secret (don't put it in fly.toml):
   ```bash
   fly secrets set DATABASE_URL="postgresql://user:pass@host:5432/dbname?sslmode=require"
   ```

4. Deploy:
   ```bash
   fly deploy
   ```

5. Your API will be live at `https://food-bill-tracker.fly.dev`.

   Run the schema against your production DB once, the same way as local setup (step 3 above).

## Redeploying after changes

```bash
fly deploy
```
