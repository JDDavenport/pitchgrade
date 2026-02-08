# PitchGrade

AI-powered pitch deck analyzer. Upload a PDF pitch deck, get scored on 12 VC criteria with detailed feedback.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Auth:** Better Auth (email/password + Google OAuth)
- **Database:** Turso (libSQL) — works on Vercel serverless
- **Payments:** Stripe (subscriptions)
- **AI:** OpenAI GPT-4o-mini

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Turso database:**
   ```bash
   # Install Turso CLI
   curl -sSfL https://get.tur.so/install.sh | bash

   # Run setup script
   ./turso-setup.sh
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Fill in TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, and other values
   ```

4. **Run Better Auth migration:**
   ```bash
   npx @better-auth/cli migrate
   ```

5. **Start dev server:**
   ```bash
   npm run dev
   ```

### Local Development (without Turso)

For local dev, you can use a local SQLite file:
```
TURSO_DATABASE_URL=file:./auth.db
TURSO_AUTH_TOKEN=
```

## Deploy on Vercel

1. Run `turso-setup.sh` to create your Turso database
2. Add `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` to Vercel environment variables
3. Add all other env vars (Stripe, OpenAI, Google OAuth, Better Auth)
4. Deploy via `vercel` or Git push
