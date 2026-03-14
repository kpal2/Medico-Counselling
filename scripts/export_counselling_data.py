from __future__ import annotations

import json
import sqlite3
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
DB_PATH = REPO_ROOT / "db" / "neet_counselling.sqlite"
OUTPUT_PATH = REPO_ROOT / "public" / "data" / "counselling-data.json"


def rows_to_dicts(cursor: sqlite3.Cursor, query: str) -> list[dict]:
    return [dict(row) for row in cursor.execute(query)]


def build_payload() -> dict:
    with sqlite3.connect(DB_PATH) as connection:
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
                round_number,
                opening_rank,
                closing_rank,
                admitted_count
            FROM cutoff_summary
            ORDER BY institute_name, subject_name, round_number, quota_name, category_name
            """,
        )

        colleges = rows_to_dicts(
            cursor,
            """
            SELECT
                i.code,
                i.name,
                i.city,
                i.state,
                i.postal_code,
                COUNT(a.id) AS total_admissions,
                MIN(a.air_rank) AS best_rank,
                MAX(a.air_rank) AS last_rank
            FROM institutes i
            JOIN admissions a ON a.institute_id = i.id
            GROUP BY i.id
            ORDER BY i.name
            """,
        )

        subjects_by_college = rows_to_dicts(
            cursor,
            """
            SELECT
                i.code AS institute_code,
                s.name AS subject_name
            FROM admissions a
            JOIN institutes i ON i.id = a.institute_id
            JOIN subjects s ON s.id = a.subject_id
            GROUP BY i.code, s.name
            ORDER BY i.code, s.name
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
            "rounds": [row["round_number"] for row in rows_to_dicts(cursor, "SELECT round_number FROM rounds ORDER BY round_number")],
            "states": [row["state"] for row in rows_to_dicts(cursor, "SELECT DISTINCT state FROM institutes WHERE state <> '' ORDER BY state")],
        }

        meta = {
            "totalAdmissions": cursor.execute("SELECT COUNT(*) FROM admissions").fetchone()[0],
            "totalInstitutes": cursor.execute("SELECT COUNT(*) FROM institutes").fetchone()[0],
            "totalCutoffGroups": cursor.execute("SELECT COUNT(*) FROM cutoff_summary").fetchone()[0],
        }

    return {
        "meta": meta,
        "options": options,
        "colleges": colleges,
        "cutoffs": cutoffs,
    }


def main() -> None:
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    payload = build_payload()
    OUTPUT_PATH.write_text(json.dumps(payload, ensure_ascii=True), encoding="utf-8")
    print(f"Wrote {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
