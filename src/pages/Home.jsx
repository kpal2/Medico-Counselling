import { Link } from "react-router-dom";
import { useCounsellingData } from "../hooks/useCounsellingData";
import { formatRank } from "../lib/counsellingData";

const Home = () => {
  const { data } = useCounsellingData();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__inner">
          <div className="hero__left">
            <div className="pill">Updated for NEET counselling data</div>

            <h1 className="hero__title">
              Master Your Medical <br />
              <span className="hero__accent">Counselling Strategy</span>
            </h1>

            <p className="hero__subtitle">
              Explore real admitted records, closing ranks, and institute-level cutoffs from the imported counselling database.
            </p>

            <div className="hero__cta">
              <Link className="ctaBtn ctaBtn--primary" to="/explore">
                Check Counselling Trends <span aria-hidden="true">-&gt;</span>
              </Link>
              <Link className="ctaBtn ctaBtn--ghost" to="/predictor">
                College Predictor
              </Link>
            </div>
          </div>

          <div className="hero__right" aria-hidden="true">
            <div className="heroArt" />
          </div>
        </div>
      </section>

      <section className="trust">
        <div className="trust__inner">
          <h2 className="sectionTitle">Why Trust MediCounsel?</h2>
          <p className="sectionSubtitle">
            The interface is now backed by the imported counselling database instead of static placeholder cards.
          </p>

          <div className="cardGrid">
            <div className="infoCard">
              <div className="infoIcon" aria-hidden="true">#</div>
              <div className="infoTitle">Real Admissions</div>
              <div className="infoText">
                {data ? `${formatRank(data.meta.totalAdmissions)} admitted records are available to explore.` : "Loading admissions from the database export."}
              </div>
            </div>

            <div className="infoCard infoCard--raised">
              <div className="infoIcon" aria-hidden="true">#</div>
              <div className="infoTitle">Institute Coverage</div>
              <div className="infoText">
                {data ? `${formatRank(data.meta.totalInstitutes)} institutes and ${formatRank(data.meta.totalCutoffGroups)} cutoff combinations are indexed.` : "Loading institute coverage."}
              </div>
            </div>

            <div className="infoCard">
              <div className="infoIcon" aria-hidden="true">#</div>
              <div className="infoTitle">Actionable Filters</div>
              <div className="infoText">
                Filter by subject, quota, category, state, and round without leaving the frontend.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
