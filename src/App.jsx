import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import HistoricalExplorer from "./pages/HistoricalExplorer";
import LastRankFinder from "./pages/LastRankFinder";
import CollegePredictor from "./pages/CollegePredictor";
import Colleges from "./pages/Colleges";
import CollegeDetail from "./pages/CollegeDetail";
import About from "./pages/About";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<HistoricalExplorer />} />
          <Route path="/cutoff" element={<LastRankFinder />} />
          <Route path="/predictor" element={<CollegePredictor />} />
          <Route path="/colleges" element={<Colleges />} />
          <Route path="/college/:code" element={<CollegeDetail />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
