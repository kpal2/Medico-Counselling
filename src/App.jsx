import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { AuthProvider } from "./hooks/useAuth.jsx";

import Home from "./pages/Home";
import HistoricalExplorer from "./pages/HistoricalExplorer";
import LastRankFinder from "./pages/LastRankFinder";
import CollegePredictor from "./pages/CollegePredictor";
import Colleges from "./pages/Colleges";
import CollegeDetail from "./pages/CollegeDetail";
import About from "./pages/About";

function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;
