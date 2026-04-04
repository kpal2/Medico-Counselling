from __future__ import annotations

import argparse
import json
import sqlite3
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DB_PATH = REPO_ROOT / "db" / "neet_counselling.sqlite"
DEFAULT_OUTPUT_PATH = REPO_ROOT / "public" / "data" / "counselling-data.json"


def rows_to_dicts(cursor: sqlite3.Cursor, query: str) -> list[dict]:
    return [dict(row) for row in cursor.execute(query)]


def build_payload(db_path: Path) -> dict:
    with sqlite3.connect(db_path) as connection:
        connection.row_factory = sqlite3.Row
        cursor = connection.cursor()

        cutoffs = rows_to_dicts(
            cursor,
            """
            SELECT
                institute_code,
                institute_name,
                city,
                state,
                subject_name,
                quota_name,
                category_name,
                allotted_category_name,
                sub_category_name,
                ph_status_name,
                counselling_year,
                round_number,
                opening_rank,
                closing_rank,
                admitted_count
            FROM cutoff_summary
            ORDER BY counselling_year DESC, institute_name, subject_name, round_number, quota_name, category_name
            """,
        )

        colleges = rows_to_dicts(
            cursor,
            """
            SELECT
                i.code,
                i.name,
                '' AS city,
                s.name AS state,
                '' AS postal_code,
                COUNT(pc.id) AS total_admissions,
                MIN(pc.closing_rank) AS best_rank,
                MAX(pc.closing_rank) AS last_rank
            FROM institutes i
            JOIN states s ON s.id = i.state_id
            JOIN pg_cutoffs pc ON pc.institute_id = i.id
            GROUP BY i.id
            ORDER BY i.name
            """,
        )

        subjects_by_college = rows_to_dicts(
            cursor,
            """
            SELECT
                i.code AS institute_code,
                subj.name AS subject_name
            FROM pg_cutoffs pc
            JOIN institutes i ON i.id = pc.institute_id
            JOIN subjects subj ON subj.id = pc.subject_id
            GROUP BY i.code, subj.name
            ORDER BY i.code, subj.name
            """,
        )

        subject_map: dict[str, list[str]] = {}
        for row in subjects_by_college:
            subject_map.setdefault(row["institute_code"], []).append(row["subject_name"])

        for college in colleges:
            college["subjects"] = subject_map.get(college["code"], [])

        options = {
            "subjects": [row["name"] for row in rows_to_dicts(cursor, "SELECT name FROM subjects ORDER BY name")],
            "categories": [row["name"] for row in rows_to_dicts(cursor, "SELECT name FROM categories ORDER BY name")],
            "quotas": [row["name"] for row in rows_to_dicts(cursor, "SELECT name FROM quotas ORDER BY name")],
            "rounds": [row["round_number"] for row in rows_to_dicts(cursor, "SELECT DISTINCT round_number FROM pg_cutoffs ORDER BY round_number")],
            "states": [row["name"] for row in rows_to_dicts(cursor, "SELECT name FROM states ORDER BY name")],
            "years": [row["counselling_year"] for row in rows_to_dicts(cursor, "SELECT DISTINCT counselling_year FROM pg_cutoffs ORDER BY counselling_year DESC")],
        }

        meta = {
            "totalAdmissions": cursor.execute("SELECT COUNT(*) FROM pg_cutoffs").fetchone()[0],
            "totalInstitutes": cursor.execute("SELECT COUNT(*) FROM institutes").fetchone()[0],
            "totalCutoffGroups": cursor.execute("SELECT COUNT(*) FROM cutoff_summary").fetchone()[0],
        }

    return {
        "meta": meta,
        "options": options,
        "colleges": colleges,
        "cutoffs": cutoffs,
    }


def export_payload(db_path: Path, output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    payload = build_payload(db_path)
    output_path.write_text(json.dumps(payload, ensure_ascii=True), encoding="utf-8")
    print(f"Wrote {output_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Export PG counselling SQLite data into static JSON for the frontend.")
    parser.add_argument("--db", type=Path, default=DEFAULT_DB_PATH, help="Path to the source PG SQLite database.")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT_PATH, help="Path to the exported PG JSON file.")
    args = parser.parse_args()

    export_payload(args.db.resolve(), args.output.resolve())


if __name__ == "__main__":
    main()
