import { Link } from "react-router-dom";
import { useCounsellingData } from "../hooks/useCounsellingData";
import { formatRank } from "../lib/counsellingData";

const Footer = () => {
  const { data } = useCounsellingData();

  return (
    <footer className="footer">
      <section className="statsBand">
        <div className="statsBand__inner">
          <div className="stat">
            <div className="stat__num">{data ? formatRank(data.meta.totalAdmissions) : "..."}</div>
            <div className="stat__label">Admitted Records</div>
          </div>
          <div className="stat">
            <div className="stat__num">{data ? formatRank(data.meta.totalCutoffGroups) : "..."}</div>
            <div className="stat__label">Cutoff Groups</div>
          </div>
          <div className="stat">
            <div className="stat__num">{data ? formatRank(data.meta.totalInstitutes) : "..."}</div>
            <div className="stat__label">Institutes</div>
          </div>
          <div className="stat">
            <div className="stat__num">5</div>
            <div className="stat__label">Counselling Rounds</div>
          </div>
        </div>
      </section>

      <section className="footerMain">
        <div className="footerMain__inner">
          <div className="footerCol footerBrand">
            <div className="brandRow">
              <div className="logoMark" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 7c-2.2 0-4 1.8-4 4v2c0 4.4 3.6 8 8 8h2c2.2 0 4-1.8 4-4v-2c0-4.4-3.6-8-8-8H7Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.85"
                  />
                  <path
                    d="M17 7h0.8A3.2 3.2 0 0 1 21 10.2v3.6A3.2 3.2 0 0 1 17.8 17H17"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.65"
                  />
                </svg>
              </div>
              <div className="brandName">CounselFlow</div>
            </div>

            <p className="footerText">
              A unified counselling platform shell with dedicated experiences for each admission track.
            </p>
          </div>

          <div className="footerCol">
            <div className="footerTitle">Quick Links</div>
            <Link className="footerLink" to="/">Home</Link>
            <Link className="footerLink" to="/medical">Medical Counselling</Link>
            <Link className="footerLink" to="/engineering">JEE Counselling</Link>
            <Link className="footerLink" to="/explore">Counselling Trends</Link>
          </div>

          <div className="footerCol">
            <div className="footerTitle">Resources</div>
            <Link className="footerLink" to="/predictor">College Predictor</Link>
            <Link className="footerLink" to="/colleges">Colleges</Link>
            <Link className="footerLink" to="/cutoff">Cutoff Search</Link>
            <Link className="footerLink" to="/about">About</Link>
          </div>

        </div>

        <div className="footerBottom">
          <span>&copy; {new Date().getFullYear()} MediCounsel. All rights reserved.</span>
          <div className="footerBottom__links">
            <Link className="footerMiniLink" to="/about">About</Link>
            <Link className="footerMiniLink" to="/colleges">Colleges</Link>
            <Link className="footerMiniLink" to="/cutoff">Cutoffs</Link>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
