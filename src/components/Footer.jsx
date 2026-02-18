const Footer = () => {
  return (
    <footer className="footer">
      <section className="statsBand">
        <div className="statsBand__inner">
          <div className="stat">
            <div className="stat__num">50k+</div>
            <div className="stat__label">Candidates Guided</div>
          </div>
          <div className="stat">
            <div className="stat__num">98%</div>
            <div className="stat__label">Prediction Accuracy</div>
          </div>
          <div className="stat">
            <div className="stat__num">450+</div>
            <div className="stat__label">Medical Colleges</div>
          </div>
          <div className="stat">
            <div className="stat__num">24/7</div>
            <div className="stat__label">Support during Rounds</div>
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
              <div className="brandName">MediCounsel</div>
            </div>

            <p className="footerText">
              Empowering medical aspirants with data-driven insights for a successful counselling career.
              Trust the numbers, not the rumors.
            </p>

            <div className="socialRow" aria-label="social links">
              <a className="socialBtn" href="#" aria-label="Twitter">𝕏</a>
              <a className="socialBtn" href="#" aria-label="Facebook">f</a>
              <a className="socialBtn" href="#" aria-label="Instagram">⌁</a>
              <a className="socialBtn" href="#" aria-label="LinkedIn">in</a>
            </div>
          </div>

          <div className="footerCol">
            <div className="footerTitle">Quick Links</div>
            <a className="footerLink" href="/">Home</a>
            <a className="footerLink" href="/explore">Counselling Trends</a>
            <a className="footerLink" href="/predictor">College Predictor</a>
            <a className="footerLink" href="#">Premium Plans</a>
          </div>

          <div className="footerCol">
            <div className="footerTitle">Resources</div>
            <a className="footerLink" href="#">NEET PG 2026 Bulletin</a>
            <a className="footerLink" href="#">Seat Matrix</a>
            <a className="footerLink" href="#">Rank Analysis</a>
            <a className="footerLink" href="#">College Reviews</a>
          </div>

          <div className="footerCol">
            <div className="footerTitle">Contact Us</div>

            <div className="contactItem">
              <span className="contactIcon" aria-hidden="true">📍</span>
              <span>123 Medical Enclave, Health City, New Delhi - 110001</span>
            </div>

            <div className="contactItem">
              <span className="contactIcon" aria-hidden="true">📞</span>
              <span>+91 98765 43210</span>
            </div>

            <div className="contactItem">
              <span className="contactIcon" aria-hidden="true">✉️</span>
              <span>support@medicounsel.com</span>
            </div>
          </div>
        </div>

        <div className="footerBottom">
          <span>© {new Date().getFullYear()} MediCounsel. All rights reserved.</span>
          <div className="footerBottom__links">
            <a className="footerMiniLink" href="#">Privacy Policy</a>
            <a className="footerMiniLink" href="#">Terms</a>
            <a className="footerMiniLink" href="#">Support</a>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
