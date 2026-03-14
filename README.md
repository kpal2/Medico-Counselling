# NEET Counselling Web

This repo now includes a normalized relational database setup for the admitted-data CSV in [`public/All India_All_Round_25.xlsx - Admitted_Data.csv`](/c:/Users/amite/Downloads/project/neet-counselling-web/public/All%20India_All_Round_25.xlsx%20-%20Admitted_Data.csv).

## Database layout

The schema lives in [`db/schema.sql`](/c:/Users/amite/Downloads/project/neet-counselling-web/db/schema.sql) and splits the CSV into:

- `institutes`
- `quotas`
- `categories`
- `sub_categories`
- `subjects`
- `allotted_categories`
- `ph_statuses`
- `rounds`
- `admissions`

`admissions` is the fact table. Everything else is a lookup or dimension table.

The schema also creates a `cutoff_summary` view with opening rank, closing rank, and admitted count grouped by institute, subject, quota, category, PH status, and round. That is the most direct source for pages like last-rank finder, college detail, and trend exploration.

## Build the database

Run:

```bash
python scripts/import_counselling_csv.py
```

or:

```bash
npm run db:import
```

Then export the frontend dataset:

```bash
python scripts/export_counselling_data.py
```

or refresh both the SQLite database and the static JSON used by the Vite app:

```bash
npm.cmd run db:refresh
```

That creates:

- [`db/neet_counselling.sqlite`](/c:/Users/amite/Downloads/project/neet-counselling-web/db/neet_counselling.sqlite)
- [`public/data/counselling-data.json`](/c:/Users/amite/Downloads/project/neet-counselling-web/public/data/counselling-data.json)

You can also override paths:

```bash
python scripts/import_counselling_csv.py --csv "public/All India_All_Round_25.xlsx - Admitted_Data.csv" --db db/neet_counselling.sqlite
```

## Notes

- Source row count detected from the CSV: `27758`
- Distinct institute codes in the CSV: `574`
- Subjects present in the CSV: `MBBS`, `BDS`, `B.Sc. Nursing`
- The importer derives `name`, `address`, `city`, `state`, and `postal_code` for each institute when the CSV format is reliable enough, and always preserves the original value in `raw_label`

## Static deployment on Vercel

This project is ready to deploy as a static site. In production:

- Vercel serves the built Vite app from `dist`
- Vercel also serves the exported dataset from `public/data/counselling-data.json`
- there is no live backend
- there is no production database connection

The production data flow is:

```text
CSV -> local SQLite -> exported JSON -> Vercel
```

### Before pushing updates

Whenever the source CSV changes, refresh the dataset locally:

```bash
npm.cmd run db:refresh
```

Then commit the updated files, especially:

- `public/data/counselling-data.json`
- any related code changes

### Deploy steps

1. Push the repo to GitHub.
2. Import the repo into Vercel.
3. Use these build settings:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy.

### Routing

This repo includes:

- [`public/_redirects`](/c:/Users/amite/Downloads/project/neet-counselling-web/public/_redirects) for Netlify-style hosting
- [`vercel.json`](/c:/Users/amite/Downloads/project/neet-counselling-web/vercel.json) for Vercel SPA rewrites

That ensures routes like `/explore`, `/cutoff`, and `/college/200502` still work after a browser refresh.

## Authentication with Supabase

The app now includes frontend auth wiring for:

- Google sign-in
- phone number OTP sign-in

Code paths:

- [`src/lib/supabase.js`](/c:/Users/amite/Downloads/project/neet-counselling-web/src/lib/supabase.js)
- [`src/hooks/useAuth.jsx`](/c:/Users/amite/Downloads/project/neet-counselling-web/src/hooks/useAuth.jsx)
- [`src/components/AuthModal.jsx`](/c:/Users/amite/Downloads/project/neet-counselling-web/src/components/AuthModal.jsx)

### Environment variables

Create a local `.env` file from [`.env.example`](/c:/Users/amite/Downloads/project/neet-counselling-web/.env.example):

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

Recommended:

- use `.env.local` on your machine
- do not commit `.env.local`
- keep only `.env.example` in git
- add the same values in Vercel Project Settings -> Environment Variables for deployment

Set the same variables in Vercel Project Settings -> Environment Variables.

### Supabase dashboard setup

In your Supabase project:

1. Go to `Authentication -> Providers -> Google`
2. Enable Google
3. Add your Google OAuth client ID and secret
4. Set the redirect URL to your deployed site URL

For phone login:

1. Go to `Authentication -> Providers -> Phone`
2. Enable phone auth
3. Configure OTP / SMS delivery in Supabase using the provider supported in your project dashboard
4. Use E.164 phone numbers in the UI, for example `+919876543210`

### Production redirect URLs

Make sure these URLs are allowed in Supabase Auth settings:

- your Vercel production domain
- your local dev URL, typically `http://localhost:5173`
