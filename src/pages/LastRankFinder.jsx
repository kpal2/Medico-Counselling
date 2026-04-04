import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCounsellingData } from "../hooks/useCounsellingData";
import { formatRank } from "../lib/counsellingData";

const defaultSort = {
  key: "closing_rank",
  direction: "desc",
};

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

const sortValueGetters = {
  institute_name: (row) => row.institute_name ?? "",
  state: (row) => row.state ?? "",
  quota_name: (row) => row.quota_name ?? "",
  category_name: (row) => row.category_name ?? "",
  round_number: (row) => Number(row.round_number) || 0,
  closing_rank: (row) => Number(row.closing_rank) || 0,
};

const compareValues = (left, right) => {
  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }

  return String(left).localeCompare(String(right), "en", { sensitivity: "base" });
};

const LastRankFinder = () => {
  const { data, loading, error } = useCounsellingData();
  const [subject, setSubject] = useState("MBBS");
  const [category, setCategory] = useState("General");
  const [quota, setQuota] = useState("All");
  const [round, setRound] = useState("All");
  const [state, setState] = useState("All");
  const [sortConfig, setSortConfig] = useState(defaultSort);

  const toggleSort = (key) => {
    setSortConfig((current) => {
      if (current.key === key) {
        return {
          key,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }

      return {
        key,
        direction: key === "closing_rank" ? "desc" : "asc",
      };
    });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) {
      return " <>";
    }

    return sortConfig.direction === "asc" ? " ^" : " v";
  };

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
      .sort((left, right) => {
        const getValue = sortValueGetters[sortConfig.key];
        const leftValue = getValue(left);
        const rightValue = getValue(right);
        const comparison = compareValues(leftValue, rightValue);

        if (comparison !== 0) {
          return sortConfig.direction === "asc" ? comparison : -comparison;
        }

        return right.closing_rank - left.closing_rank;
      })
      .slice(0, 100);
  }, [category, data, quota, round, sortConfig, state, subject]);

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
              <th>
                <button className="tableSortButton" type="button" onClick={() => toggleSort("institute_name")}>
                  College{getSortIndicator("institute_name")}
                </button>
              </th>
              <th>
                <button className="tableSortButton" type="button" onClick={() => toggleSort("state")}>
                  State{getSortIndicator("state")}
                </button>
              </th>
              <th>
                <button className="tableSortButton" type="button" onClick={() => toggleSort("quota_name")}>
                  Quota{getSortIndicator("quota_name")}
                </button>
              </th>
              <th>
                <button className="tableSortButton" type="button" onClick={() => toggleSort("category_name")}>
                  Category{getSortIndicator("category_name")}
                </button>
              </th>
              <th>
                <button className="tableSortButton" type="button" onClick={() => toggleSort("round_number")}>
                  Round{getSortIndicator("round_number")}
                </button>
              </th>
              <th>
                <button className="tableSortButton" type="button" onClick={() => toggleSort("closing_rank")}>
                  Closing Rank{getSortIndicator("closing_rank")}
                </button>
              </th>
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
