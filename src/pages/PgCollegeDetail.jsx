import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useCounsellingData } from "../hooks/useCounsellingData";
import { formatRank } from "../lib/counsellingData";

const PgCollegeDetail = () => {
  const { code } = useParams();
  const { data, loading, error } = useCounsellingData("pg");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");

  const college = useMemo(
    () => data?.colleges.find((item) => item.code === code),
    [code, data],
  );

  const cutoffs = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.cutoffs
      .filter((item) => item.institute_code === code)
      .filter((item) => subjectFilter === "All" || item.subject_name === subjectFilter)
      .filter((item) => yearFilter === "All" || String(item.counselling_year) === yearFilter)
      .sort((left, right) => {
        if (left.subject_name !== right.subject_name) {
          return left.subject_name.localeCompare(right.subject_name);
        }
        if ((left.counselling_year ?? 0) !== (right.counselling_year ?? 0)) {
          return (right.counselling_year ?? 0) - (left.counselling_year ?? 0);
        }
        if (left.round_number !== right.round_number) {
          return left.round_number - right.round_number;
        }
        return left.closing_rank - right.closing_rank;
      });
  }, [code, data, subjectFilter, yearFilter]);

  if (loading) {
    return <div className="dataPage"><p>Loading PG college details...</p></div>;
  }

  if (error) {
    return <div className="dataPage"><p>Unable to load PG college details: {error}</p></div>;
  }

  if (!college) {
    return <div className="dataPage"><p>No PG college found for code {code}.</p></div>;
  }

  const subjects = ["All", ...college.subjects];

  return (
    <div className="dataPage">
      <div className="pageIntro">
        <h2>PG {college.name}</h2>
        <p>
          <strong>Institute Code:</strong> {code}
          {college.city ? ` • ${college.city}` : ""}
          {college.state ? ` • ${college.state}` : ""}
        </p>
      </div>

      <div className="statsGrid">
        <div className="statCard">
          <div className="metricLabel">Total Cutoff Rows</div>
          <div className="statCard__value">{formatRank(college.total_admissions)}</div>
        </div>
        <div className="statCard">
          <div className="metricLabel">Best Recorded Rank</div>
          <div className="statCard__value">{formatRank(college.best_rank)}</div>
        </div>
        <div className="statCard">
          <div className="metricLabel">Latest Closing Rank</div>
          <div className="statCard__value">{formatRank(college.last_rank)}</div>
        </div>
      </div>

      <div className="toolCard formGrid formGrid--filters">
        <label className="filterLabel">
          Subject
          <select value={subjectFilter} onChange={(event) => setSubjectFilter(event.target.value)}>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </label>
        <label className="filterLabel">
          Year
          <select value={yearFilter} onChange={(event) => setYearFilter(event.target.value)}>
            <option value="All">All</option>
            {data.options.years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="tableCard">
        <table className="dataTable">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Quota</th>
              <th>Category</th>
              <th>Year</th>
              <th>Round</th>
              <th>Opening Rank</th>
              <th>Closing Rank</th>
              <th>Admitted</th>
            </tr>
          </thead>
          <tbody>
            {cutoffs.map((row) => (
              <tr key={`${row.subject_name}-${row.quota_name}-${row.category_name}-${row.counselling_year}-${row.round_number}`}>
                <td>{row.subject_name}</td>
                <td>{row.quota_name}</td>
                <td>{row.category_name}</td>
                <td>{row.counselling_year}</td>
                <td>Round {row.round_number}</td>
                <td>{formatRank(row.opening_rank)}</td>
                <td>{formatRank(row.closing_rank)}</td>
                <td>{formatRank(row.admitted_count)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PgCollegeDetail;
