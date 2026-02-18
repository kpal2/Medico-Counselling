import CutoffChart from "../components/CutoffChart";

const dummyResults = [
  {
    type: "Govt",
    city: "New Delhi",
    state: "Delhi",
    name: "All India Institute of Medical Sciences (AIIMS)",
    cutoff: 45,
    fees: "₹ 2,500/year",
    courses: ["MD General Medicine", "MS Surgery"],
    chance: "Low",
  },
  {
    type: "Private",
    city: "Vellore",
    state: "Tamil Nadu",
    name: "Christian Medical College (CMC)",
    cutoff: 1200,
    fees: "₹ 48,000/year",
    courses: ["MD Pediatrics", "MD Radiology"],
    chance: "Medium",
  },
  {
    type: "Govt",
    city: "Chennai",
    state: "Tamil Nadu",
    name: "Madras Medical College",
    cutoff: 850,
    fees: "₹ 18,000/year",
    courses: ["MS Orthopedics", "MD Anesthesiology"],
    chance: "High",
  },
  {
    type: "Deemed",
    city: "Manipal",
    state: "Karnataka",
    name: "Kasturba Medical College",
    cutoff: 4500,
    fees: "₹ 25,00,000/year",
    courses: ["MD Dermatology", "MS OBG"],
    chance: "High",
  },
];

const chanceClass = (chance) => {
  if (chance === "High") return "pillChance pillChance--high";
  if (chance === "Medium") return "pillChance pillChance--medium";
  return "pillChance pillChance--low";
};

const HistoricalExplorer = () => {
  return (
    <div className="trendsPage">
      {/* LEFT FILTERS */}
      <aside className="filtersCard">
        <div className="filtersHeader">
          <span className="filtersIcon">⎇</span>
          <h3>Smart Filters</h3>
        </div>

        <div className="filterBlock">
          <label>Counselling Type</label>
          <select>
            <option>All India Quota (AIQ)</option>
            <option>State Quota</option>
            <option>Deemed / Paid</option>
          </select>
        </div>

        <div className="filterBlock">
          <label>Course / Specialty</label>
          <select>
            <option>MD General Medicine</option>
            <option>MD Radiology</option>
            <option>MS Surgery</option>
          </select>
        </div>

        <div className="filterBlock">
          <label>Category</label>
          <select>
            <option>General / Open</option>
            <option>OBC</option>
            <option>SC</option>
            <option>ST</option>
            <option>EWS</option>
          </select>
        </div>

        <div className="filterBlock">
          <div className="sliderRow">
            <label>Max Annual Fees</label>
            <span className="feeValue">₹25L</span>
          </div>
          <input type="range" min="0" max="25" defaultValue="8" />
        </div>

        <button className="applyBtn">Apply Filters</button>
      </aside>

      {/* RIGHT CONTENT */}
      <section className="trendsMain">
        {/* Charts row (dummy) */}
        <div className="chartRow">
          <CutoffChart
            title="MD General Medicine Cutoff"
            subtitle="Closing Rank vs Year"
            points={[30, 35, 42, 55, 63]}
          />
          <CutoffChart
            title="MD Radiology Cutoff"
            subtitle="Closing Rank vs Year"
            points={[22, 28, 34, 44, 58]}
          />
        </div>

        {/* Header row */}
        <div className="resultsHeader">
          <div className="resultsTitle">
            <h2>Top Recommendations</h2>
            <span className="infoDot" title="Based on historical trends">i</span>
          </div>
          <div className="resultsMeta">Showing {dummyResults.length} of 385 results</div>
        </div>

        {/* Results list */}
        <div className="resultsList">
          {dummyResults.map((r, idx) => (
            <div className="resultCard" key={idx}>
              <div className="resultCard__top">
                <div className="leftMeta">
                  <span className={`pillType pillType--${r.type.toLowerCase()}`}>{r.type}</span>
                  <span className="locDot">•</span>
                  <span className="locText">{r.city}, {r.state}</span>
                </div>
                <span className={chanceClass(r.chance)}>{r.chance} Chance</span>
              </div>

              <div className="collegeName">{r.name}</div>

              <div className="metricsRow">
                <div className="metric">
                  <div className="metricLabel">Cutoff Rank (2025)</div>
                  <div className="metricValue">~ {r.cutoff}</div>
                </div>
                <div className="metric">
                  <div className="metricLabel">Annual Fees</div>
                  <div className="metricValue">{r.fees}</div>
                </div>
                <div className="metric">
                  <div className="metricLabel">Top Courses</div>
                  <div className="metricValue metricChips">
                    {r.courses.map((c) => (
                      <span className="chip" key={c}>{c}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="resultActions">
                <button className="btnSecondary">View Details</button>
                <button className="btnPrimary">Check Eligibility</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HistoricalExplorer;
