PRAGMA foreign_keys = ON;

DROP VIEW IF EXISTS cutoff_summary;
DROP TABLE IF EXISTS admissions;
DROP TABLE IF EXISTS institutes;
DROP TABLE IF EXISTS quotas;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS sub_categories;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS allotted_categories;
DROP TABLE IF EXISTS ph_statuses;
DROP TABLE IF EXISTS rounds;

CREATE TABLE quotas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE sub_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE allotted_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE ph_statuses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE rounds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    round_number INTEGER NOT NULL UNIQUE
);

CREATE TABLE institutes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    address TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    raw_label TEXT NOT NULL
);

CREATE TABLE admissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    roll_number TEXT NOT NULL,
    air_rank REAL NOT NULL,
    option_number INTEGER NOT NULL,
    institute_id INTEGER NOT NULL,
    quota_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    sub_category_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    allotted_category_id INTEGER NOT NULL,
    ph_status_id INTEGER NOT NULL,
    round_id INTEGER NOT NULL,
    FOREIGN KEY (institute_id) REFERENCES institutes(id),
    FOREIGN KEY (quota_id) REFERENCES quotas(id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (sub_category_id) REFERENCES sub_categories(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (allotted_category_id) REFERENCES allotted_categories(id),
    FOREIGN KEY (ph_status_id) REFERENCES ph_statuses(id),
    FOREIGN KEY (round_id) REFERENCES rounds(id)
);

CREATE INDEX idx_admissions_institute ON admissions(institute_id);
CREATE INDEX idx_admissions_rank ON admissions(air_rank);
CREATE INDEX idx_admissions_lookup ON admissions(
    institute_id,
    subject_id,
    quota_id,
    category_id,
    allotted_category_id,
    round_id
);

CREATE VIEW cutoff_summary AS
SELECT
    a.institute_id,
    i.code AS institute_code,
    i.name AS institute_name,
    i.city,
    i.state,
    a.subject_id,
    s.name AS subject_name,
    a.quota_id,
    q.name AS quota_name,
    a.category_id,
    c.name AS category_name,
    a.allotted_category_id,
    ac.name AS allotted_category_name,
    a.sub_category_id,
    sc.name AS sub_category_name,
    a.ph_status_id,
    ph.name AS ph_status_name,
    a.round_id,
    r.round_number,
    MIN(a.air_rank) AS opening_rank,
    MAX(a.air_rank) AS closing_rank,
    COUNT(*) AS admitted_count
FROM admissions a
JOIN institutes i ON i.id = a.institute_id
JOIN subjects s ON s.id = a.subject_id
JOIN quotas q ON q.id = a.quota_id
JOIN categories c ON c.id = a.category_id
JOIN allotted_categories ac ON ac.id = a.allotted_category_id
JOIN sub_categories sc ON sc.id = a.sub_category_id
JOIN ph_statuses ph ON ph.id = a.ph_status_id
JOIN rounds r ON r.id = a.round_id
GROUP BY
    a.institute_id,
    i.code,
    i.name,
    i.city,
    i.state,
    a.subject_id,
    s.name,
    a.quota_id,
    q.name,
    a.category_id,
    c.name,
    a.allotted_category_id,
    ac.name,
    a.sub_category_id,
    sc.name,
    a.ph_status_id,
    ph.name,
    a.round_id,
    r.round_number;
