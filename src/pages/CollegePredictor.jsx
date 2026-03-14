import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCounsellingData } from "../hooks/useCounsellingData";
import { estimateChance, formatRank } from "../lib/counsellingData";

const CollegePredictor = () => {
  const { data, loading, error } = useCounsellingData();
  const [rank, setRank] = useState("");
  const [category, setCategory] = useState("General");
  const [subject, setSubject] = useState("MBBS");
  const [state, setState] = useState("All");

  const numericRank = Number(rank);
  const predictions = useMemo(() => {
    if (!data || !numericRank) {
      return [];
    }

    return data.cutoffs
      .filter((row) => row.subject_name === subject)
      .filter((row) => row.category_name === category)
      .filter((row) => state === "All" || row.state === state)
      .filter((row) => row.closing_rank >= numericRank)
      .map((row) => ({
        ...row,
        gap: row.closing_rank - numericRank,
        chance: estimateChance(numericRank, row.closing_rank),
      }))
      .sort((left, right) => left.gap - right.gap)
      .slice(0, 12);
  }, [category, data, numericRank, state, subject]);

  if (loading) {
    return <div className="predictorPage"><p>Loading prediction data...</p></div>;
  }

  if (error) {
    return <div className="predictorPage"><p>Unable to load prediction data: {error}</p></div>;
  }

  return (
    <div className="predictorPage">
      <div className="predictorHeader">
        <div className="predictorIcon">#</div>
        <h1>College Predictor</h1>
        <p>Enter your rank and compare it against recorded closing ranks from the database export.</p>
      </div>

      <div className="predictorCard">
        <h3 className="cardTitle">Enter Your Details</h3>

        <div className="formGrid">
          <div className="formGroup">
            <label>NEET Rank</label>
            <input
              type="number"
              placeholder="e.g. 4500"
              value={rank}
              onChange={(event) => setRank(event.target.value)}
            />
          </div>

          <div className="formGroup">
            <label>Category</label>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {data.options.categories.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="formGroup">
            <label>Preferred Course</label>
            <select value={subject} onChange={(event) => setSubject(event.target.value)}>
              {data.options.subjects.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="formGroup">
            <label>State Preference</label>
            <select value={state} onChange={(event) => setState(event.target.value)}>
              <option value="All">All India</option>
              {data.options.states.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <button className="predictBtn" type="button">
          Predict My Colleges
        </button>
      </div>

      {!!predictions.length && (
        <div className="resultsList predictorResults">
          {predictions.map((row) => (
            <div className="resultCard" key={`${row.institute_code}-${row.quota_name}-${row.round_number}-${row.category_name}`}>
              <div className="resultCard__top">
                <div className="leftMeta">
                  <span className="pillType pillType--govt">{row.subject_name}</span>
                  <span className="locDot">•</span>
                  <span className="locText">{row.state || "State not available"}</span>
                </div>
                <span className={`pillChance pillChance--${row.chance.toLowerCase()}`}>{row.chance} Chance</span>
              </div>

              <div className="collegeName">{row.institute_name}</div>

              <div className="metricsRow">
                <div className="metric">
                  <div className="metricLabel">Closing Rank</div>
                  <div className="metricValue">{formatRank(row.closing_rank)}</div>
                </div>
                <div className="metric">
                  <div className="metricLabel">Quota</div>
                  <div className="metricValue">{row.quota_name}</div>
                </div>
                <div className="metric">
                  <div className="metricLabel">Round</div>
                  <div className="metricValue">Round {row.round_number}</div>
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
      )}
    </div>
  );
};

export default CollegePredictor;
