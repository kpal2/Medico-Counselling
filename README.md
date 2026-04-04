# NEET Counselling Web

This repository now includes separate relational-data pipelines for:

- [`public/All India &States 23to25 - All India &States 23to25_PG.csv`](/c:/Users/amite/Downloads/project/neet-counselling-web/public/All%20India%20%26States%2023to25%20-%20All%20India%20%26States%2023to25_PG.csv) for PG
- [`public/All India_All_Round_25.xlsx_Admitted_Data_UG.csv`](/c:/Users/amite/Downloads/project/neet-counselling-web/public/All%20India_All_Round_25.xlsx_Admitted_Data_UG.csv) for UG

## Database layout

UG uses [`db/schema.sql`](/c:/Users/amite/Downloads/project/neet-counselling-web/db/schema.sql) and splits the admitted-data CSV into:

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

That schema also creates a `cutoff_summary` view with opening rank, closing rank, and admitted count grouped by institute, subject, quota, category, PH status, and round.

PG uses [`db/schema_pg.sql`](/c:/Users/amite/Downloads/project/neet-counselling-web/db/schema_pg.sql), which normalizes the summary-style PG cutoff CSV into quotas, categories, states, subjects, institutes, and `pg_cutoffs`.

## Build the PG database

Run:

```bash
python scripts/import_counselling_csv_pg.py
```

or:

```bash
npm run db:import
```

Then export the frontend dataset:

```bash
python scripts/export_counselling_data_pg.py
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
python scripts/import_counselling_csv_pg.py --csv "public/All India &States 23to25 - All India &States 23to25_PG.csv" --db db/neet_counselling.sqlite
```

## Build the UG database

Run:

```bash
python scripts/import_counselling_csv_ug.py
```

or:

```bash
npm run db:import:ug
```

Then export the frontend dataset:

```bash
python scripts/export_counselling_data_ug.py
```

or refresh both the UG SQLite database and its static JSON:

```bash
npm.cmd run db:refresh:ug
```

That creates:

- [`db/neet_counselling_ug.sqlite`](/c:/Users/amite/Downloads/project/neet-counselling-web/db/neet_counselling_ug.sqlite)
- [`public/data/counselling-data-ug.json`](/c:/Users/amite/Downloads/project/neet-counselling-web/public/data/counselling-data-ug.json)

You can also override paths:

```bash
python scripts/import_counselling_csv_ug.py --csv "public/All India_All_Round_25.xlsx_Admitted_Data_UG.csv" --db db/neet_counselling_ug.sqlite
```

## Notes

- UG source row count detected from the CSV: `27758`
- UG distinct institute codes in the CSV: `574`
- UG subjects present in the CSV: `MBBS`, `BDS`, `B.Sc. Nursing`
- The UG importer derives `name`, `address`, `city`, `state`, and `postal_code` for each institute when the CSV format is reliable enough, and always preserves the original value in `raw_label`
- The PG importer expands columns like `CR 2024 1` into year/round-specific cutoff rows and parses tokens like `56(8)` into `closing_rank=56` and `admitted_count=8`

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
