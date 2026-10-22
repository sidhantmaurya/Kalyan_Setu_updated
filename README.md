# KalyanSetu — Serving Nourishment, Building Connection

**Affordable Food. Dignified Lives.**  
Founder: **Divyansh Rai** (Central University of Kerala)  
Business Category: Restaurants and mobile food service activities (NIC Code: `56100`)

---

## Architecture Overview

1. **Managed PostgreSQL Database & Drizzle ORM (`src/db/`)**:
   - `profiles`: Stores Google-authenticated users and roles (`user` | `admin`).
   - `contact_messages`: Stores all contact inquiries with validation, honeypot protection, rate limiting (max 5/hour per email), status tracking (`new` | `read` | `replied` | `archived`), internal admin notes, and email notification timestamps.
   - `newsletter_subscribers`: Stores footer newsletter sign-ups.
2. **Google Sign-In Authentication (`src/lib/firebase.ts`, `src/lib/firebase-admin.ts`)**:
   - Google OAuth (`openid`, `email`, `profile`) is the sole sign-in method; no passwords are stored or handled anywhere.
   - Server-side ID token verification via `firebase-admin` and role-based access enforcement (`requireAuth`, `requireAdmin`).
3. **Contact Pipeline & Admin Email Notification (`src/lib/email.ts`)**:
   - Escapes all user-supplied fields before generating the Navy/Gold branded HTML and plain-text notification emails.
   - Sends transactional emails via **Resend** (`RESEND_API_KEY`) when configured, and provides a live HTML email preview & retry trigger inside `/admin/messages`.
4. **Full Sitemap (`src/pages/`)**:
   - Public routes: `/`, `/about`, `/founder`, `/people`, `/progress`, `/contact`, `/login`, `/privacy`, `/terms`
   - Authenticated user route: `/dashboard`
   - Admin routes: `/admin/login`, `/admin`, `/admin/messages`, `/admin/users`, `/admin/subscribers`

---

## Deployment on Vercel

This project is ready to deploy on Vercel as a Vite app with serverless API routes.

### Files added for Vercel
- `vercel.json` – configures the Vercel build and rewrite rules
- `api/index.ts` – serverless API endpoints for contact notifications and health checks
- `.env.production.example` – sample environment variables for production deployment

### Required Vercel project settings
In the Vercel dashboard, add the following environment variables:

- `GEMINI_API_KEY`
- `APP_URL`
- `SITE_URL`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_DATABASE_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `VITE_FIREBASE_OAUTH_CLIENT_ID`
- `RESEND_API_KEY`
- `ADMIN_NOTIFY_EMAILS`
- `NOTIFY_FROM_EMAIL`
- `SEND_AUTOREPLY`

### Deploy steps
1. Push this repository to GitHub.
2. Import the repo into Vercel.
3. Select the project root as the app directory.
4. Set the framework to Vite (or allow Vercel to detect it automatically).
5. Add the environment variables listed above.
6. Deploy.

### Notes for production readiness
- Use a custom domain like `https://kalyansetu.in` in `SITE_URL` and `APP_URL`.
- Keep secret keys in Vercel environment variables instead of the repo.
- If you later add a PostgreSQL database, configure a Vercel Postgres resource and map the database env vars there.
- For scaling, move all long-lived backend logic and admin workflows to a dedicated server or managed infra if traffic grows.
