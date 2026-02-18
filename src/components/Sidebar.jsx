const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h3>Filters</h3>

      <div className="filter-group">
        <label>Year</label>
        <select>
          <option>2024</option>
          <option>2023</option>
          <option>2022</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Course</label>
        <select>
          <option>MBBS</option>
          <option>BDS</option>
          <option>BSc Nursing</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Category</label>
        <select>
          <option>General</option>
          <option>OBC</option>
          <option>SC</option>
          <option>ST</option>
          <option>EWS</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Quota</label>
        <select>
          <option>All India</option>
          <option>Open Seat</option>
          <option>State Quota</option>
        </select>
      </div>
    </aside>
  );
};

export default Sidebar;
