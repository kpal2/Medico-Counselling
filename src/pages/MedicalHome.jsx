import { Link } from "react-router-dom";
import { useCounsellingData } from "../hooks/useCounsellingData";
import { formatRank } from "../lib/counsellingData";

const MedicalHome = () => {
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
            <div className="pill">Medical counselling track - live admissions intelligence</div>

            <h1 className="medicoHero__title">
              Decode your <span className="hero__accent">medical counselling</span> path before and during the rounds.
            </h1>

            <p className="medicoHero__subtitle">
              This is the Medico experience inside the broader counselling platform. Use the tabs to move from trends to predictor to cutoff search, all backed by the current and updated trusted data.
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
              <strong>MediCounsel dashboard</strong>
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

    </div>
  );
};

export default MedicalHome;
