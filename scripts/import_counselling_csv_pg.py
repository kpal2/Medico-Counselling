from __future__ import annotations

import argparse
import csv
import re
import sqlite3
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CSV_PATH = REPO_ROOT / "public" / "All India &States 23to25 - All India &States 23to25_PG.csv"
DEFAULT_DB_PATH = REPO_ROOT / "db" / "neet_counselling.sqlite"
SCHEMA_PATH = REPO_ROOT / "db" / "schema_pg.sql"

CUTOFF_COLUMN_PATTERN = re.compile(r"^CR (?P<year>\d{4}) (?P<round>\d+)$")
CUTOFF_VALUE_PATTERN = re.compile(r"^(?P<rank>\d+(?:\.\d+)?)(?:\((?P<count>\d+)\))?$")


def normalize_text(value: str | None) -> str:
    return (value or "").strip()


def slugify(value: str) -> str:
    compact = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return compact or "unknown"


def load_schema(connection: sqlite3.Connection) -> None:
    connection.executescript(SCHEMA_PATH.read_text(encoding="utf-8"))


def get_or_create(cursor: sqlite3.Cursor, table: str, value: str, cache: dict[tuple[str, str], int]) -> int:
    key = (table, value)
    if key in cache:
        return cache[key]

    cursor.execute(f"INSERT INTO {table} (name) VALUES (?) ON CONFLICT(name) DO NOTHING", (value,))
    cursor.execute(f"SELECT id FROM {table} WHERE name = ?", (value,))
    row = cursor.fetchone()
    if row is None:
        raise RuntimeError(f"Unable to resolve id for {table}={value!r}")

    cache[key] = row[0]
    return row[0]


def get_or_create_institute(
    cursor: sqlite3.Cursor,
    institute_name: str,
    state_id: int,
    state_name: str,
    cache: dict[tuple[str, str], int],
) -> int:
    key = (institute_name, state_name)
    if key in cache:
        return cache[key]

    institute_code = slugify(f"{state_name}-{institute_name}")
    cursor.execute(
        """
        INSERT INTO institutes (code, name, state_id, raw_label)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(code) DO UPDATE SET
            name = excluded.name,
            state_id = excluded.state_id,
            raw_label = excluded.raw_label
        """,
        (institute_code, institute_name, state_id, institute_name),
    )
    cursor.execute("SELECT id FROM institutes WHERE code = ?", (institute_code,))
    row = cursor.fetchone()
    if row is None:
        raise RuntimeError(f"Unable to resolve institute id for {institute_name!r}")

    cache[key] = row[0]
    return row[0]


def parse_cutoff_token(value: str) -> tuple[float, int] | None:
    token = normalize_text(value)
    if not token:
        return None

    match = CUTOFF_VALUE_PATTERN.match(token)
    if match is None:
        raise ValueError(f"Unexpected cutoff token: {token}")

    rank = float(match.group("rank"))
    admitted_count = int(match.group("count") or 0)
    return rank, admitted_count


def import_csv(csv_path: Path, db_path: Path) -> None:
    db_path.parent.mkdir(parents=True, exist_ok=True)

    with sqlite3.connect(db_path) as connection:
        connection.execute("PRAGMA foreign_keys = ON")
        load_schema(connection)
        cursor = connection.cursor()

        dim_cache: dict[tuple[str, str], int] = {}
        institute_cache: dict[tuple[str, str], int] = {}
        cutoff_rows = []

        with csv_path.open("r", encoding="utf-8-sig", newline="") as csv_file:
            reader = csv.DictReader(csv_file)
            cutoff_columns = [
                (column, int(match.group("year")), int(match.group("round")))
                for column in reader.fieldnames or []
                for match in [CUTOFF_COLUMN_PATTERN.match(column)]
                if match is not None
            ]

            for row in reader:
                quota_id = get_or_create(cursor, "quotas", normalize_text(row["Quota"]), dim_cache)
                category_id = get_or_create(cursor, "categories", normalize_text(row["Category"]), dim_cache)
                subject_id = get_or_create(cursor, "subjects", normalize_text(row["Course"]), dim_cache)
                state_name = normalize_text(row["State"])
                state_id = get_or_create(cursor, "states", state_name, dim_cache)
                institute_id = get_or_create_institute(
                    cursor,
                    normalize_text(row["Institute"]),
                    state_id,
                    state_name,
                    institute_cache,
                )

                for column, year, round_number in cutoff_columns:
                    parsed_cutoff = parse_cutoff_token(row[column])
                    if parsed_cutoff is None:
                        continue

                    closing_rank, admitted_count = parsed_cutoff
                    cutoff_rows.append(
                        (
                            institute_id,
                            quota_id,
                            category_id,
                            subject_id,
                            state_id,
                            year,
                            round_number,
                            closing_rank,
                            admitted_count,
                            normalize_text(row["Fee"]),
                            normalize_text(row["Stipend Year 1"]),
                            normalize_text(row["Bond Years"]),
                            normalize_text(row["Bond Penalty"]),
                            normalize_text(row["Beds"]),
                        )
                    )

        cursor.executemany(
            """
            INSERT INTO pg_cutoffs (
                institute_id,
                quota_id,
                category_id,
                subject_id,
                state_id,
                counselling_year,
                round_number,
                closing_rank,
                admitted_count,
                fee,
                stipend_year_1,
                bond_years,
                bond_penalty,
                beds
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            cutoff_rows,
        )
        connection.commit()

        total_cutoffs = cursor.execute("SELECT COUNT(*) FROM pg_cutoffs").fetchone()[0]
        total_institutes = cursor.execute("SELECT COUNT(*) FROM institutes").fetchone()[0]
        print(f"Imported {total_cutoffs} PG cutoff rows across {total_institutes} institutes into {db_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Import PG counselling cutoff CSV into a normalized SQLite database.")
    parser.add_argument("--csv", type=Path, default=DEFAULT_CSV_PATH, help="Path to the source PG CSV file.")
    parser.add_argument("--db", type=Path, default=DEFAULT_DB_PATH, help="Path to the output PG SQLite database.")
    args = parser.parse_args()

    import_csv(args.csv.resolve(), args.db.resolve())


if __name__ == "__main__":
    main()
