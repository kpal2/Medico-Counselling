import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="platformHome">
      <section className="platformHero">
        <div className="platformHero__bg" aria-hidden="true">
          <div className="platformHero__blob platformHero__blob--one" />
          <div className="platformHero__blob platformHero__blob--two" />
          <div className="platformHero__blob platformHero__blob--three" />
          <div className="platformHero__lines" />
        </div>

        <div className="platformHero__inner">
          <div className="platformHero__copy">
            <div className="pill">A unified counselling experience</div>

            <h1 className="platformHero__title">
              Choose your <span className="hero__accent">counselling track</span> and enter the right dashboard.
            </h1>
          </div>

          <div className="trackChooser">
            <Link className="trackChoice trackChoice--medical" to="/medical">
              <span className="trackChoice__badge">Live now</span>
              <h2>Medical Counselling</h2>
              <p>Open the Medico dashboard for trends, cutoff search, predictor flows, and college-level medical insights.</p>
              <span className="trackChoice__action">Enter Medical</span>
            </Link>

            <Link className="trackChoice trackChoice--engineering" to="/engineering">
              <span className="trackChoice__badge">Coming next</span>
              <h2>JEE Counselling</h2>
              <p>Engineering counselling will open here with rank analysis, branch discovery, and institute-level decision tools.</p>
              <span className="trackChoice__action">View Status</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="platformShowcase">
        <div className="platformShowcase__inner">
          <div className="showcaseBand">
            <span>Medical dashboards</span>
            <span>Engineering workflows</span>
            <span>Track-based navigation</span>
            <span>One platform shell</span>
            <span>Static deployment friendly</span>
            <span>Medical dashboards</span>
            <span>Engineering workflows</span>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
