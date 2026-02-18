import { Link } from "react-router-dom";

const Colleges = () => {
  return (
    <div>
      <h2>Colleges</h2>
      <ul>
        <li>
          <Link to="/college/200502">AIIMS New Delhi</Link>
        </li>
        <li>
          <Link to="/college/200521">JIPMER Puducherry</Link>
        </li>
        <li>
          <Link to="/college/200505">AIIMS Jodhpur</Link>
        </li>
      </ul>
    </div>
  );
};

export default Colleges;
