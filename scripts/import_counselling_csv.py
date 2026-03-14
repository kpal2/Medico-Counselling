from __future__ import annotations

import argparse
import csv
import sqlite3
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CSV_PATH = REPO_ROOT / "public" / "All India_All_Round_25.xlsx - Admitted_Data.csv"
DEFAULT_DB_PATH = REPO_ROOT / "db" / "neet_counselling.sqlite"
SCHEMA_PATH = REPO_ROOT / "db" / "schema.sql"


def normalize_text(value: str | None) -> str:
    return (value or "").strip()


def parse_air_rank(value: str) -> float:
    return float(normalize_text(value))


def parse_int(value: str) -> int:
    return int(float(normalize_text(value)))


def looks_like_city(value: str) -> bool:
    compact = value.replace(" ", "")
    return bool(value) and compact.isalpha() and len(value.split()) <= 3 and len(compact) > 4


def split_institute(raw_label: str) -> tuple[str, str, str, str, str]:
    parts = [part.strip() for part in raw_label.split(",")]
    name = parts[0] if parts else raw_label.strip()
    city = ""
    address = ""
    postal_code = parts[-1] if len(parts) >= 1 else ""
    state = parts[-2] if len(parts) >= 2 else ""

    if len(parts) >= 5 and looks_like_city(parts[1]):
        city = parts[1]
        address = ",".join(parts[2:-2]).strip()
        if len(name.split()) <= 3:
            name = f"{name}, {city}"
    elif len(parts) >= 4:
        address = ",".join(parts[1:-2]).strip()
    elif len(parts) >= 2:
        address = parts[1]

    return name, address, city, state, postal_code


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


def get_or_create_round(cursor: sqlite3.Cursor, round_number: int, cache: dict[int, int]) -> int:
    if round_number in cache:
        return cache[round_number]

    cursor.execute(
        "INSERT INTO rounds (round_number) VALUES (?) ON CONFLICT(round_number) DO NOTHING",
        (round_number,),
    )
    cursor.execute("SELECT id FROM rounds WHERE round_number = ?", (round_number,))
    row = cursor.fetchone()
    if row is None:
        raise RuntimeError(f"Unable to resolve id for round={round_number}")

    cache[round_number] = row[0]
    return row[0]


def get_or_create_institute(
    cursor: sqlite3.Cursor,
    institute_code: str,
    raw_label: str,
    cache: dict[str, int],
) -> int:
    if institute_code in cache:
        return cache[institute_code]

    name, address, city, state, postal_code = split_institute(raw_label)
    cursor.execute(
        """
        INSERT INTO institutes (code, name, address, city, state, postal_code, raw_label)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(code) DO UPDATE SET
            name = excluded.name,
            address = excluded.address,
            city = excluded.city,
            state = excluded.state,
            postal_code = excluded.postal_code,
            raw_label = excluded.raw_label
        """,
        (institute_code, name, address, city, state, postal_code, raw_label),
    )
    cursor.execute("SELECT id FROM institutes WHERE code = ?", (institute_code,))
    row = cursor.fetchone()
    if row is None:
        raise RuntimeError(f"Unable to resolve institute id for code={institute_code}")

    cache[institute_code] = row[0]
    return row[0]


def load_schema(connection: sqlite3.Connection) -> None:
    connection.executescript(SCHEMA_PATH.read_text(encoding="utf-8"))


def import_csv(csv_path: Path, db_path: Path) -> None:
    db_path.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(db_path) as connection:
        connection.execute("PRAGMA foreign_keys = ON")
        load_schema(connection)
        cursor = connection.cursor()

        dim_cache: dict[tuple[str, str], int] = {}
        round_cache: dict[int, int] = {}
        institute_cache: dict[str, int] = {}

        with csv_path.open("r", encoding="utf-8-sig", newline="") as csv_file:
            reader = csv.DictReader(csv_file)
            admission_rows = []

            for row in reader:
                institute_id = get_or_create_institute(
                    cursor,
                    normalize_text(row["InstituteCode"]),
                    normalize_text(row["Institute"]),
                    institute_cache,
                )
                quota_id = get_or_create(cursor, "quotas", normalize_text(row["QuotaName"]), dim_cache)
                category_id = get_or_create(cursor, "categories", normalize_text(row["Category"]), dim_cache)
                sub_category_id = get_or_create(
                    cursor,
                    "sub_categories",
                    normalize_text(row["SubCategory"]),
                    dim_cache,
                )
                subject_id = get_or_create(cursor, "subjects", normalize_text(row["Subject"]), dim_cache)
                allotted_category_id = get_or_create(
                    cursor,
                    "allotted_categories",
                    normalize_text(row["AllottedCategory"]),
                    dim_cache,
                )
                ph_status_id = get_or_create(cursor, "ph_statuses", normalize_text(row["AllotedPH"]), dim_cache)
                round_id = get_or_create_round(cursor, parse_int(row["AdmittedRound"]), round_cache)

                admission_rows.append(
                    (
                        normalize_text(row["Rollno"]),
                        parse_air_rank(row["AIR"]),
                        parse_int(row["OptionNo"]),
                        institute_id,
                        quota_id,
                        category_id,
                        sub_category_id,
                        subject_id,
                        allotted_category_id,
                        ph_status_id,
                        round_id,
                    )
                )

        cursor.executemany(
            """
            INSERT INTO admissions (
                roll_number,
                air_rank,
                option_number,
                institute_id,
                quota_id,
                category_id,
                sub_category_id,
                subject_id,
                allotted_category_id,
                ph_status_id,
                round_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            admission_rows,
        )
        connection.commit()

        total_admissions = cursor.execute("SELECT COUNT(*) FROM admissions").fetchone()[0]
        total_institutes = cursor.execute("SELECT COUNT(*) FROM institutes").fetchone()[0]
        print(f"Imported {total_admissions} admissions across {total_institutes} institutes into {db_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Import counselling CSV into a normalized SQLite database.")
    parser.add_argument("--csv", type=Path, default=DEFAULT_CSV_PATH, help="Path to the source CSV file.")
    parser.add_argument("--db", type=Path, default=DEFAULT_DB_PATH, help="Path to the output SQLite database.")
    args = parser.parse_args()

    import_csv(args.csv.resolve(), args.db.resolve())


if __name__ == "__main__":
    main()
