import { Link } from "react-router-dom";
import { useCounsellingData } from "../hooks/useCounsellingData";
import { formatRank } from "../lib/counsellingData";

const Home = () => {
  const { data } = useCounsellingData();

  return (
    <div className="home">
      <section className="medicoHero">
        <div className="medicoHero__bg" aria-hidden="true">
          <div className="medicoHero__orb medicoHero__orb--one" />
          <div className="medicoHero__orb medicoHero__orb--two" />
          <div className="medicoHero__mesh" />
        </div>

        <div className="medicoHero__inner">
          <div className="medicoHero__copy">
            <div className="pill">Medico track • live admissions intelligence</div>

            <h1 className="medicoHero__title">
              Decode your <span className="hero__accent">medical counselling</span> path before the round opens.
            </h1>

            <p className="medicoHero__subtitle">
              This is the Medico landing page inside the broader counselling ecosystem. Use the same tabs to move from trends to predictor to cutoff search, all backed by the current imported dataset.
            </p>

            <div className="hero__cta">
              <Link className="ctaBtn ctaBtn--primary" to="/explore">
                Explore Trends
              </Link>
              <Link className="ctaBtn ctaBtn--ghost" to="/predictor">
                Open Predictor
              </Link>
              <Link className="ctaBtn ctaBtn--ghost" to="/cutoff">
                Search Cutoffs
              </Link>
            </div>

            <div className="medicoHero__metrics">
              <div className="heroStatCard">
                <span className="heroStatCard__label">Admissions indexed</span>
                <strong>{data ? formatRank(data.meta.totalAdmissions) : "..."}</strong>
              </div>
              <div className="heroStatCard">
                <span className="heroStatCard__label">Institutes covered</span>
                <strong>{data ? formatRank(data.meta.totalInstitutes) : "..."}</strong>
              </div>
              <div className="heroStatCard">
                <span className="heroStatCard__label">Cutoff groups</span>
                <strong>{data ? formatRank(data.meta.totalCutoffGroups) : "..."}</strong>
              </div>
            </div>
          </div>

          <div className="medicoHero__visual" aria-hidden="true">
            <div className="signalCard signalCard--primary">
              <span className="signalCard__tag">Round pulse</span>
              <strong>Medical counselling dashboard</strong>
              <span>Trend analysis, rank prediction, last-rank finder, and college drilldowns.</span>
            </div>

            <div className="signalCard signalCard--secondary">
              <span className="signalCard__tag">Live scope</span>
              <strong>{data ? `${formatRank(data.meta.totalInstitutes)} institutes` : "Loading institutes"}</strong>
              <span>One entry point, same tabs, deeper guidance.</span>
            </div>

            <div className="waveStack">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </section>

      <section className="homeRibbon">
        <div className="homeRibbon__inner">
          <div className="homeRibbon__track">
            <span>Trend explorer</span>
            <span>College predictor</span>
            <span>Last rank finder</span>
            <span>College drilldowns</span>
            <span>Static deploy ready</span>
            <span>Trend explorer</span>
            <span>College predictor</span>
            <span>Last rank finder</span>
          </div>
        </div>
      </section>

      <section className="gatewaySection">
        <div className="gatewaySection__inner">
          <h2 className="sectionTitle">Same tabs, different depth</h2>
          <p className="sectionSubtitle">
            Once a user chooses the Medico track, the navigation stays stable. The value comes from how fast each tab answers a different counselling question.
          </p>

          <div className="gatewayGrid">
            <Link className="gatewayCard gatewayCard--wide" to="/explore">
              <span className="gatewayCard__eyebrow">Trends</span>
              <h3>See how closing ranks move across rounds.</h3>
              <p>Filter by subject, category, quota, and state to watch the counselling pattern tighten or relax.</p>
            </Link>

            <Link className="gatewayCard" to="/predictor">
              <span className="gatewayCard__eyebrow">Predictor</span>
              <h3>Map your rank to realistic options.</h3>
              <p>Use your current rank against recorded closing ranks and shortlist likely outcomes.</p>
            </Link>

            <Link className="gatewayCard" to="/cutoff">
              <span className="gatewayCard__eyebrow">Cutoff search</span>
              <h3>Jump straight to the last rank.</h3>
              <p>Fast lookup for colleges, categories, quotas, rounds, and state-specific filters.</p>
            </Link>

            <Link className="gatewayCard" to="/colleges">
              <span className="gatewayCard__eyebrow">College pages</span>
              <h3>Drill into institute-level detail.</h3>
              <p>Inspect admission footprint, round-wise openings, and closing positions from one place.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="trust">
        <div className="trust__inner">
          <h2 className="sectionTitle">Built for fast decision-making during counselling</h2>
          <p className="sectionSubtitle">
            The homepage is not trying to explain everything. It gets you into the right medical workflow quickly, then lets the existing tabs do the heavy lifting.
          </p>

          <div className="cardGrid">
            <div className="infoCard">
              <div className="infoIcon" aria-hidden="true">01</div>
              <div className="infoTitle">Real admissions base</div>
              <div className="infoText">
                {data ? `${formatRank(data.meta.totalAdmissions)} admitted rows are already indexed for the Medico track.` : "Loading admissions base."}
              </div>
            </div>

            <div className="infoCard infoCard--raised">
              <div className="infoIcon" aria-hidden="true">02</div>
              <div className="infoTitle">One navigation model</div>
              <div className="infoText">
                Trends, predictor, cutoffs, and colleges stay in the same shell so the user does not relearn the product every time.
              </div>
            </div>

            <div className="infoCard">
              <div className="infoIcon" aria-hidden="true">03</div>
              <div className="infoTitle">Expandable later</div>
              <div className="infoText">
                The larger ecosystem can add Engineering outside this page, while this Medico landing remains focused and familiar.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
