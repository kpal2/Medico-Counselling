import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero__inner">
          <div className="hero__left">
            <div className="pill">Updated for NEET PG 2026</div>

            <h1 className="hero__title">
              Master Your Medical <br />
              <span className="hero__accent">Counselling Strategy</span>
            </h1>

            <p className="hero__subtitle">
              Data-driven insights for MBBS and BDS graduates. Analyze trends, predict your chances,
              and secure your dream PG seat with confidence.
            </p>

            <div className="hero__cta">
              <Link className="ctaBtn ctaBtn--primary" to="/explore">
                Check Counselling Trends <span aria-hidden="true">→</span>
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

      {/* TRUST */}
      <section className="trust">
        <div className="trust__inner">
          <h2 className="sectionTitle">Why Trust MediCounsel?</h2>
          <p className="sectionSubtitle">
            We process millions of data points from previous years' counselling rounds to give you the most accurate predictions.
          </p>

          <div className="cardGrid">
            <div className="infoCard">
              <div className="infoIcon" aria-hidden="true">📊</div>
              <div className="infoTitle">5-Year Trend Analysis</div>
              <div className="infoText">
                Deep dive into opening and closing ranks for every college and specialty across India.
              </div>
            </div>

            <div className="infoCard infoCard--raised">
              <div className="infoIcon" aria-hidden="true">🛡️</div>
              <div className="infoTitle">Verified Seat Matrix</div>
              <div className="infoText">
                Real-time updates on seat availability for All India Quota, State Quota, and Deemed Universities.
              </div>
            </div>

            <div className="infoCard">
              <div className="infoIcon" aria-hidden="true">👥</div>
              <div className="infoTitle">Community Insights</div>
              <div className="infoText">
                Connect with previous year toppers and get mentorship on choice filling strategies.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
