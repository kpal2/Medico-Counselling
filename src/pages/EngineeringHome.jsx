import { Link } from "react-router-dom";

const EngineeringHome = () => {
  return (
    <div className="constructionPage">
      <div className="constructionCard">
        <div className="pill">Track status</div>
        <h1>JEE Counselling is under construction</h1>
        <p>
          The engineering track will live here once the data pipeline, branch-level exploration, and institute workflows are ready.
        </p>
        <div className="hero__cta">
          <Link className="ctaBtn ctaBtn--primary" to="/">
            Back to Platform Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EngineeringHome;
