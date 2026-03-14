import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CutoffChart from "../components/CutoffChart";
import { useCounsellingData } from "../hooks/useCounsellingData";
import { buildChartPoints, formatRank } from "../lib/counsellingData";

const summarizeByRound = (rows) => {
  const grouped = new Map();

  rows.forEach((row) => {
    const current = grouped.get(row.round_number);

    if (!current || row.closing_rank < current.closing_rank) {
      grouped.set(row.round_number, row);
    }
  });

  return [...grouped.values()].sort((left, right) => left.round_number - right.round_number);
};

const chanceClass = (chance) => {
  if (chance === "High") return "pillChance pillChance--high";
  if (chance === "Medium") return "pillChance pillChance--medium";
  return "pillChance pillChance--low";
};

const buildChartDetails = (rows, labelPrefix) => (
  rows.map((row) => ({
    label: `Round ${row.round_number}`,
    value: `Closing AIR ${formatRank(row.closing_rank)}`,
    meta: [
      { label: "Institute", value: row.institute_name ?? "-" },
      { label: "Quota", value: row.quota_name ?? "-" },
      { label: "Category", value: row.category_name ?? "-" },
      { label: labelPrefix, value: row.subject_name ?? "-" },
      { label: "Admitted", value: formatRank(row.admitted_count) },
    ],
  }))
);

const HistoricalExplorer = () => {
  const { data, loading, error } = useCounsellingData();
  const [subject, setSubject] = useState("MBBS");
  const [category, setCategory] = useState("General");
  const [quota, setQuota] = useState("All");
  const [state, setState] = useState("All");

  const filteredRows = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.cutoffs
      .filter((row) => row.subject_name === subject)
      .filter((row) => category === "All" || row.category_name === category)
      .filter((row) => quota === "All" || row.quota_name === quota)
      .filter((row) => state === "All" || row.state === state)
      .sort((left, right) => left.closing_rank - right.closing_rank);
  }, [category, data, quota, state, subject]);

  const recommendations = filteredRows.slice(0, 25).map((row, index) => ({
    ...row,
    type: row.quota_name.includes("Deemed") ? "Deemed" : "Govt",
    city: row.city || row.state || "-",
    cutoff: row.closing_rank,
    chance: index < 8 ? "Low" : index < 16 ? "Medium" : "High",
    courses: [row.subject_name, row.quota_name],
  }));

  const topCollegeRows = useMemo(() => {
    if (!filteredRows.length) {
      return [];
    }

    const topCollege = filteredRows[0].institute_name;
    return summarizeByRound(
      filteredRows.filter((row) => row.institute_name === topCollege),
    );
  }, [filteredRows]);

  const roundSnapshot = useMemo(
    () => summarizeByRound(filteredRows),
    [filteredRows],
  );

  if (loading) {
    return <div className="dataPage"><p>Loading trend data...</p></div>;
  }

  if (error) {
    return <div className="dataPage"><p>Unable to load trend data: {error}</p></div>;
  }

  return (
    <div className="trendsPage">
      <aside className="filtersCard">
        <div className="filtersHeader">
          <span className="filtersIcon">#</span>
          <h3>Smart Filters</h3>
        </div>

        <div className="filterBlock">
          <label>Quota</label>
          <select value={quota} onChange={(event) => setQuota(event.target.value)}>
            <option value="All">All</option>
            {data.options.quotas.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="filterBlock">
          <label>Course / Subject</label>
          <select value={subject} onChange={(event) => setSubject(event.target.value)}>
            {data.options.subjects.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="filterBlock">
          <label>Category</label>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="All">All</option>
            {data.options.categories.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="filterBlock">
          <label>State</label>
          <select value={state} onChange={(event) => setState(event.target.value)}>
            <option value="All">All</option>
            {data.options.states.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </aside>

      <section className="trendsMain">
        <div className="chartRow">
          <CutoffChart
            title={topCollegeRows[0] ? `${topCollegeRows[0].institute_name} cutoff` : "Top college cutoff"}
            subtitle="Closing rank by round"
            points={buildChartPoints(topCollegeRows)}
            years={topCollegeRows.map((row) => `R${row.round_number}`)}
            details={buildChartDetails(topCollegeRows, "Subject")}
          />
          <CutoffChart
            title={`${subject} snapshot`}
            subtitle="Best visible cutoffs in current filter"
            points={buildChartPoints(roundSnapshot)}
            years={roundSnapshot.map((row) => `R${row.round_number}`)}
            details={buildChartDetails(roundSnapshot, "Subject")}
          />
        </div>

        <div className="resultsHeader">
          <div className="resultsTitle">
            <h2>Top Recommendations</h2>
            <span className="infoDot" title="Based on imported cutoff data">i</span>
          </div>
          <div className="resultsMeta">Showing {recommendations.length} of {filteredRows.length} results</div>
        </div>

        <div className="resultsList">
          {recommendations.map((row) => (
            <div className="resultCard" key={`${row.institute_code}-${row.quota_name}-${row.round_number}-${row.category_name}`}>
              <div className="resultCard__top">
                <div className="leftMeta">
                  <span className={`pillType pillType--${row.type.toLowerCase()}`}>{row.type}</span>
                  <span className="locDot">•</span>
                  <span className="locText">{row.city}, {row.state || "-"}</span>
                </div>
                <span className={chanceClass(row.chance)}>{row.chance} Chance</span>
              </div>

              <div className="collegeName">{row.institute_name}</div>

              <div className="metricsRow">
                <div className="metric">
                  <div className="metricLabel">Cutoff Rank</div>
                  <div className="metricValue">{formatRank(row.cutoff)}</div>
                </div>
                <div className="metric">
                  <div className="metricLabel">Quota</div>
                  <div className="metricValue">{row.quota_name}</div>
                </div>
                <div className="metric">
                  <div className="metricLabel">Applied Filters</div>
                  <div className="metricValue metricChips">
                    {row.courses.map((item) => (
                      <span className="chip" key={item}>{item}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="resultActions">
                <Link className="btnPrimary" to={`/college/${row.institute_code}`}>
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HistoricalExplorer;
