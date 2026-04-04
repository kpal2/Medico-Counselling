import { useDeferredValue, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCounsellingData } from "../hooks/useCounsellingData";
import { formatRank } from "../lib/counsellingData";

const PgColleges = () => {
  const { data, loading, error } = useCounsellingData("pg");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const colleges = useMemo(() => {
    if (!data) {
      return [];
    }

    const query = deferredSearch.trim().toLowerCase();

    return data.colleges
      .filter((college) => {
        if (!query) {
          return true;
        }

        return [college.name, college.code, college.city, college.state, ...(college.subjects || [])]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query));
      })
      .slice(0, 60);
  }, [data, deferredSearch]);

  if (loading) {
    return <div className="dataPage"><p>Loading PG colleges...</p></div>;
  }

  if (error) {
    return <div className="dataPage"><p>Unable to load PG college data: {error}</p></div>;
  }

  return (
    <div className="dataPage">
      <div className="pageIntro">
        <h2>PG Colleges</h2>
        <p>Browse institutes from the PG counselling dataset.</p>
      </div>

      <div className="toolCard">
        <input
          className="textInput"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by college, code, city, state, or subject"
        />
      </div>

      <div className="resultsList">
        {colleges.map((college) => (
          <div className="resultCard" key={college.code}>
            <div className="resultCard__top">
              <div>
                <div className="collegeName">{college.name}</div>
                <div className="locText">
                  {college.code}
                  {college.city ? ` • ${college.city}` : ""}
                  {college.state ? ` • ${college.state}` : ""}
                </div>
              </div>
              <Link className="btnPrimary" to={`/pg/college/${college.code}`}>
                View Details
              </Link>
            </div>

            <div className="metricsRow">
              <div className="metric">
                <div className="metricLabel">Subjects</div>
                <div className="metricValue metricChips">
                  {college.subjects.map((subject) => (
                    <span className="chip" key={subject}>{subject}</span>
                  ))}
                </div>
              </div>
              <div className="metric">
                <div className="metricLabel">Best Rank</div>
                <div className="metricValue">{formatRank(college.best_rank)}</div>
              </div>
              <div className="metric">
                <div className="metricLabel">Last Recorded Rank</div>
                <div className="metricValue">{formatRank(college.last_rank)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PgColleges;
