PRAGMA foreign_keys = OFF;

DROP VIEW IF EXISTS cutoff_summary;
DROP TABLE IF EXISTS admissions;
DROP TABLE IF EXISTS allotted_categories;
DROP TABLE IF EXISTS ph_statuses;
DROP TABLE IF EXISTS rounds;
DROP TABLE IF EXISTS sub_categories;
DROP TABLE IF EXISTS pg_cutoffs;
DROP TABLE IF EXISTS institutes;
DROP TABLE IF EXISTS quotas;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS states;

CREATE TABLE quotas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE states (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE institutes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    state_id INTEGER NOT NULL,
    raw_label TEXT NOT NULL,
    FOREIGN KEY (state_id) REFERENCES states(id)
);

CREATE TABLE pg_cutoffs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    institute_id INTEGER NOT NULL,
    quota_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    state_id INTEGER NOT NULL,
    counselling_year INTEGER NOT NULL,
    round_number INTEGER NOT NULL,
    closing_rank REAL NOT NULL,
    admitted_count INTEGER NOT NULL DEFAULT 0,
    fee TEXT,
    stipend_year_1 TEXT,
    bond_years TEXT,
    bond_penalty TEXT,
    beds TEXT,
    FOREIGN KEY (institute_id) REFERENCES institutes(id),
    FOREIGN KEY (quota_id) REFERENCES quotas(id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (state_id) REFERENCES states(id)
);

CREATE INDEX idx_pg_cutoffs_lookup ON pg_cutoffs(
    institute_id,
    subject_id,
    quota_id,
    category_id,
    counselling_year,
    round_number
);

CREATE INDEX idx_pg_cutoffs_rank ON pg_cutoffs(closing_rank);

CREATE VIEW cutoff_summary AS
SELECT
    pc.institute_id,
    i.code AS institute_code,
    i.name AS institute_name,
    '' AS city,
    s2.name AS state,
    pc.subject_id,
    subj.name AS subject_name,
    pc.quota_id,
    q.name AS quota_name,
    pc.category_id,
    c.name AS category_name,
    pc.category_id AS allotted_category_id,
    c.name AS allotted_category_name,
    0 AS sub_category_id,
    '' AS sub_category_name,
    0 AS ph_status_id,
    '' AS ph_status_name,
    pc.id AS round_id,
    pc.round_number,
    pc.counselling_year,
    pc.closing_rank AS opening_rank,
    pc.closing_rank AS closing_rank,
    pc.admitted_count
FROM pg_cutoffs pc
JOIN institutes i ON i.id = pc.institute_id
JOIN subjects subj ON subj.id = pc.subject_id
JOIN quotas q ON q.id = pc.quota_id
JOIN categories c ON c.id = pc.category_id
JOIN states s2 ON s2.id = pc.state_id;

PRAGMA foreign_keys = ON;
