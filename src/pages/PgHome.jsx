import { Link } from "react-router-dom";
import { useCounsellingData } from "../hooks/useCounsellingData";
import { formatRank } from "../lib/counsellingData";

const PgHome = () => {
  const { data } = useCounsellingData("pg");
  const latestYear = data?.options?.years?.[0] ?? "...";

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
            <div className="pill">PG counselling track - live cutoff intelligence</div>

            <h1 className="medicoHero__title">
              Decode your <span className="hero__accent">PG counselling</span> path before and during the rounds.
            </h1>

            <p className="medicoHero__subtitle">
              This is the PG experience inside the broader counselling platform. Use the tabs to move from trends to predictor to cutoff search, all backed by the dedicated PG dataset.
            </p>

            <div className="hero__cta">
              <Link className="ctaBtn ctaBtn--ghost" to="/pg/explore">
                Explore Trends
              </Link>
              <Link className="ctaBtn ctaBtn--ghost" to="/pg/predictor">
                Open Predictor
              </Link>
              <Link className="ctaBtn ctaBtn--ghost" to="/pg/cutoff">
                Search Cutoffs
              </Link>
            </div>

            <div className="medicoHero__metrics">
              <div className="heroStatCard">
                <span className="heroStatCard__label">PG cutoff rows indexed</span>
                <strong>{data ? formatRank(data.meta.totalAdmissions) : "..."}</strong>
              </div>
              <div className="heroStatCard">
                <span className="heroStatCard__label">Institutes covered</span>
                <strong>{data ? formatRank(data.meta.totalInstitutes) : "..."}</strong>
              </div>
              <div className="heroStatCard">
                <span className="heroStatCard__label">Latest counselling year</span>
                <strong>{latestYear}</strong>
              </div>
            </div>
          </div>

          <div className="medicoHero__visual" aria-hidden="true">
            <div className="signalCard signalCard--primary">
              <span className="signalCard__tag">Round pulse</span>
              <strong>PG counselling dashboard</strong>
              <span>Trend analysis, rank prediction, last-rank finder, and college drilldowns for PG counselling.</span>
            </div>

            <div className="signalCard signalCard--secondary">
              <span className="signalCard__tag">Live scope</span>
              <strong>{data ? `${formatRank(data.options.subjects.length)} PG subjects` : "Loading subjects"}</strong>
              <span>Separate PG pages, separate PG dataset, same familiar product experience.</span>
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
            <span>PG trend explorer</span>
            <span>PG predictor</span>
            <span>PG last rank finder</span>
            <span>PG college drilldowns</span>
            <span>Latest year filters</span>
            <span>PG trend explorer</span>
            <span>PG predictor</span>
            <span>PG last rank finder</span>
          </div>
        </div>
      </section>

    </div>
  );
};

export default PgHome;
