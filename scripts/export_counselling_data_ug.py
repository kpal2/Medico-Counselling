from __future__ import annotations

import argparse
from pathlib import Path

from export_counselling_data import REPO_ROOT, export_payload


DEFAULT_DB_PATH = REPO_ROOT / "db" / "neet_counselling_ug.sqlite"
DEFAULT_OUTPUT_PATH = REPO_ROOT / "public" / "data" / "counselling-data-ug.json"


def main() -> None:
    parser = argparse.ArgumentParser(description="Export UG counselling SQLite data into static JSON for the frontend.")
    parser.add_argument("--db", type=Path, default=DEFAULT_DB_PATH, help="Path to the source UG SQLite database.")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT_PATH, help="Path to the exported UG JSON file.")
    args = parser.parse_args()

    export_payload(args.db.resolve(), args.output.resolve())


if __name__ == "__main__":
    main()
