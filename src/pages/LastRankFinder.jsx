import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCounsellingData } from "../hooks/useCounsellingData";
import { formatRank } from "../lib/counsellingData";

const getResultKey = (row) =>
  [
    row.institute_code,
    row.subject_name,
    row.quota_name,
    row.category_name,
    row.allotted_category_name,
    row.sub_category_name,
    row.ph_status_name,
    row.round_number,
    row.closing_rank,
  ].join("-");

const LastRankFinder = () => {
  const { data, loading, error } = useCounsellingData();
  const [subject, setSubject] = useState("MBBS");
  const [category, setCategory] = useState("General");
  const [quota, setQuota] = useState("All");
  const [round, setRound] = useState("All");
  const [state, setState] = useState("All");

  const results = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.cutoffs
      .filter((row) => row.subject_name === subject)
      .filter((row) => category === "All" || row.category_name === category)
      .filter((row) => quota === "All" || row.quota_name === quota)
      .filter((row) => round === "All" || String(row.round_number) === round)
      .filter((row) => state === "All" || row.state === state)
      .sort((left, right) => right.closing_rank - left.closing_rank)
      .slice(0, 100);
  }, [category, data, quota, round, state, subject]);

  if (loading) {
    return <div className="dataPage"><p>Loading cutoff data...</p></div>;
  }

  if (error) {
    return <div className="dataPage"><p>Unable to load cutoff data: {error}</p></div>;
  }

  return (
    <div className="dataPage">
      <div className="pageIntro">
        <h2>Last Rank Finder</h2>
        <p>Find closing ranks by subject, category, quota, round, and state.</p>
      </div>

      <div className="toolCard formGrid formGrid--filters">
        <label className="filterLabel">
          Subject
          <select value={subject} onChange={(event) => setSubject(event.target.value)}>
            {data.options.subjects.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="filterLabel">
          Category
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="All">All</option>
            {data.options.categories.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="filterLabel">
          Quota
          <select value={quota} onChange={(event) => setQuota(event.target.value)}>
            <option value="All">All</option>
            {data.options.quotas.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="filterLabel">
          Round
          <select value={round} onChange={(event) => setRound(event.target.value)}>
            <option value="All">All</option>
            {data.options.rounds.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="filterLabel">
          State
          <select value={state} onChange={(event) => setState(event.target.value)}>
            <option value="All">All</option>
            {data.options.states.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="tableCard">
        <table className="dataTable">
          <thead>
            <tr>
              <th>College</th>
              <th>State</th>
              <th>Quota</th>
              <th>Category</th>
              <th>Round</th>
              <th>Closing Rank</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row) => (
              <tr key={getResultKey(row)}>
                <td>
                  <Link className="tableLink" to={`/college/${row.institute_code}`}>
                    {row.institute_name}
                  </Link>
                </td>
                <td>{row.state || "-"}</td>
                <td>{row.quota_name}</td>
                <td>{row.category_name}</td>
                <td>Round {row.round_number}</td>
                <td>{formatRank(row.closing_rank)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LastRankFinder;
