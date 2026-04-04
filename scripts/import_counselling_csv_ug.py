from __future__ import annotations

import argparse
from pathlib import Path

from import_counselling_csv import REPO_ROOT, import_csv


DEFAULT_CSV_PATH = REPO_ROOT / "public" / "All India_All_Round_25.xlsx_Admitted_Data_UG.csv"
DEFAULT_DB_PATH = REPO_ROOT / "db" / "neet_counselling_ug.sqlite"


def main() -> None:
    parser = argparse.ArgumentParser(description="Import UG counselling CSV into a normalized SQLite database.")
    parser.add_argument("--csv", type=Path, default=DEFAULT_CSV_PATH, help="Path to the source UG CSV file.")
    parser.add_argument("--db", type=Path, default=DEFAULT_DB_PATH, help="Path to the output UG SQLite database.")
    args = parser.parse_args()

    import_csv(args.csv.resolve(), args.db.resolve())


if __name__ == "__main__":
    main()
