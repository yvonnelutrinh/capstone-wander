import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import HomePage from "./pages/HomePage/Homepage";
import SelectionsPage from "./pages/SelectionsPage/SelectionsPage";
import ComparisonPage from "./pages/ComparisonPage/ComparisonPage";
import BreathePage from "./pages/BreathePage/BreathePage";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import EndPage from "./pages/EndPage/EndPage";
import Header from "./components/Header/Header";
export const SERVER_URL = import.meta.env.VITE_SERVER_URL;
export const SERVER_PORT = import.meta.env.VITE_SERVER_PORT;

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/select" element={<SelectionsPage />} />
          <Route path="/breathe" element={<BreathePage />} />
          <Route path="/compare" element={<ComparisonPage />} />
          <Route path="/end" element={<EndPage />} />
          <Route path="/end/:insight" element={<EndPage />} />
          <Route path="/*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
