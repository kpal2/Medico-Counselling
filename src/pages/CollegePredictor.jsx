const CollegePredictor = () => {
  return (
    <div className="predictorPage">
      <div className="predictorHeader">
        <div className="predictorIcon">
          📊
        </div>
        <h1>College Predictor</h1>
        <p>
          Enter your rank and category to see your best college options
          based on 2025 trends.
        </p>
      </div>

      <div className="predictorCard">
        <h3 className="cardTitle">Enter Your Details</h3>

        <div className="formGrid">
          <div className="formGroup">
            <label>NEET PG Rank</label>
            <input type="number" placeholder="e.g. 4500" />
          </div>

          <div className="formGroup">
            <label>Category</label>
            <select>
              <option>Select...</option>
              <option>General</option>
              <option>OBC</option>
              <option>SC</option>
              <option>ST</option>
              <option>EWS</option>
            </select>
          </div>

          <div className="formGroup">
            <label>Preferred Course</label>
            <select>
              <option>Any</option>
              <option>MD Medicine</option>
              <option>MS Surgery</option>
              <option>MD Pediatrics</option>
            </select>
          </div>

          <div className="formGroup">
            <label>State Preference</label>
            <select>
              <option>All India</option>
              <option>Delhi</option>
              <option>Maharashtra</option>
              <option>Tamil Nadu</option>
            </select>
          </div>
        </div>

        <button className="predictBtn">
          Predict My Colleges →
        </button>
      </div>
    </div>
  );
};

export default CollegePredictor;
