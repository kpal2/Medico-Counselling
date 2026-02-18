import { useParams } from "react-router-dom";

const CollegeDetail = () => {
  const { code } = useParams();

  return (
    <div>
      <h2>College Detail Page</h2>
      <p><strong>Institute Code:</strong> {code}</p>

      <div className="table-placeholder">
        Cutoff history and seat matrix will appear here
      </div>
    </div>
  );
};

export default CollegeDetail;
