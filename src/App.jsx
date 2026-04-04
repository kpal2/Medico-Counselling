import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import MedicalHome from "./pages/MedicalHome";
import PgHome from "./pages/PgHome";
import EngineeringHome from "./pages/EngineeringHome";
import HistoricalExplorer from "./pages/HistoricalExplorer";
import PgHistoricalExplorer from "./pages/PgHistoricalExplorer";
import LastRankFinder from "./pages/LastRankFinder";
import PgLastRankFinder from "./pages/PgLastRankFinder";
import CollegePredictor from "./pages/CollegePredictor";
import PgCollegePredictor from "./pages/PgCollegePredictor";
import Colleges from "./pages/Colleges";
import PgColleges from "./pages/PgColleges";
import CollegeDetail from "./pages/CollegeDetail";
import PgCollegeDetail from "./pages/PgCollegeDetail";
import About from "./pages/About";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/medical" element={<MedicalHome />} />
          <Route path="/pg" element={<PgHome />} />
          <Route path="/engineering" element={<EngineeringHome />} />
          <Route path="/explore" element={<HistoricalExplorer />} />
          <Route path="/pg/explore" element={<PgHistoricalExplorer />} />
          <Route path="/cutoff" element={<LastRankFinder />} />
          <Route path="/pg/cutoff" element={<PgLastRankFinder />} />
          <Route path="/predictor" element={<CollegePredictor />} />
          <Route path="/pg/predictor" element={<PgCollegePredictor />} />
          <Route path="/colleges" element={<Colleges />} />
          <Route path="/pg/colleges" element={<PgColleges />} />
          <Route path="/college/:code" element={<CollegeDetail />} />
          <Route path="/pg/college/:code" element={<PgCollegeDetail />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
