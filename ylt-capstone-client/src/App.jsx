import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import HomePage from "./pages/HomePage/Homepage";
import SelectionsPage from "./pages/SelectionsPage/SelectionsPage";
import ComparisonPage from "./pages/ComparisonPage/ComparisonPage";
import InsightPage from "./pages/InsightPage/InsightPage";
import BreathePage from "./pages/BreathePage/BreathePage";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import EndPage from "./pages/EndPage/EndPage";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/select" element={<SelectionsPage />} />
          <Route path="/breathe" element={<BreathePage />} />
          <Route path="/compare" element={<ComparisonPage />} />
          <Route path="/insight" element={<InsightPage />} />
          <Route path="/end" element={<EndPage />} />
          <Route path="/*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
