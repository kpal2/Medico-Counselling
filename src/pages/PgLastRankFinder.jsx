import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCounsellingData } from "../hooks/useCounsellingData";
import { formatRank } from "../lib/counsellingData";

const defaultSort = {
  key: "closing_rank",
  direction: "desc",
};

const getResultKey = (row, index) =>
  [
    row.institute_code,
    row.subject_name,
    row.quota_name,
    row.category_name,
    row.counselling_year,
    row.round_number,
    row.closing_rank,
    row.admitted_count,
    index,
  ].join("-");

const sortValueGetters = {
  institute_name: (row) => row.institute_name ?? "",
  state: (row) => row.state ?? "",
  quota_name: (row) => row.quota_name ?? "",
  category_name: (row) => row.category_name ?? "",
  year: (row) => Number(row.counselling_year) || 0,
  round_number: (row) => Number(row.round_number) || 0,
  closing_rank: (row) => Number(row.closing_rank) || 0,
};

const compareValues = (left, right) => {
  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }

  return String(left).localeCompare(String(right), "en", { sensitivity: "base" });
};

const PgLastRankFinder = () => {
  const { data, loading, error } = useCounsellingData("pg");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("All");
  const [quota, setQuota] = useState("All");
  const [round, setRound] = useState("All");
  const [state, setState] = useState("All");
  const [year, setYear] = useState("");
  const [sortConfig, setSortConfig] = useState(defaultSort);
  const activeSubject = subject || data?.options.subjects?.[0] || "";
  const activeYear = year || String(data?.options?.years?.[0] ?? "All");

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
    if (!data || !activeSubject) {
      return [];
    }

    return data.cutoffs
      .filter((row) => row.subject_name === activeSubject)
      .filter((row) => category === "All" || row.category_name === category)
      .filter((row) => quota === "All" || row.quota_name === quota)
      .filter((row) => round === "All" || String(row.round_number) === round)
      .filter((row) => state === "All" || row.state === state)
      .filter((row) => activeYear === "All" || String(row.counselling_year) === activeYear)
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
  }, [activeSubject, activeYear, category, data, quota, round, sortConfig, state]);

  if (loading) {
    return <div className="dataPage"><p>Loading PG cutoff data...</p></div>;
  }

  if (error) {
    return <div className="dataPage"><p>Unable to load PG cutoff data: {error}</p></div>;
  }

  return (
    <div className="dataPage">
      <div className="pageIntro">
        <h2>PG Last Rank Finder</h2>
        <p>Find PG closing ranks by subject, category, quota, year, round, and state.</p>
      </div>

      <div className="toolCard formGrid formGrid--filters">
        <label className="filterLabel">
          Subject
          <select value={activeSubject} onChange={(event) => setSubject(event.target.value)}>
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
        <label className="filterLabel">
          Year
          <select value={activeYear} onChange={(event) => setYear(event.target.value)}>
            <option value="All">All</option>
            {data.options.years.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="tableCard">
        <table className="dataTable">
          <thead>
            <tr>
              <th><button className="tableSortButton" type="button" onClick={() => toggleSort("institute_name")}>College{getSortIndicator("institute_name")}</button></th>
              <th><button className="tableSortButton" type="button" onClick={() => toggleSort("state")}>State{getSortIndicator("state")}</button></th>
              <th><button className="tableSortButton" type="button" onClick={() => toggleSort("quota_name")}>Quota{getSortIndicator("quota_name")}</button></th>
              <th><button className="tableSortButton" type="button" onClick={() => toggleSort("category_name")}>Category{getSortIndicator("category_name")}</button></th>
              <th><button className="tableSortButton" type="button" onClick={() => toggleSort("year")}>Year{getSortIndicator("year")}</button></th>
              <th><button className="tableSortButton" type="button" onClick={() => toggleSort("round_number")}>Round{getSortIndicator("round_number")}</button></th>
              <th><button className="tableSortButton" type="button" onClick={() => toggleSort("closing_rank")}>Closing Rank{getSortIndicator("closing_rank")}</button></th>
            </tr>
          </thead>
          <tbody>
            {results.map((row, index) => (
              <tr key={getResultKey(row, index)}>
                <td><Link className="tableLink" to={`/pg/college/${row.institute_code}`}>{row.institute_name}</Link></td>
                <td>{row.state || "-"}</td>
                <td>{row.quota_name}</td>
                <td>{row.category_name}</td>
                <td>{row.counselling_year}</td>
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

export default PgLastRankFinder;
