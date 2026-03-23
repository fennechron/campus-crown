import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import VotingPage from "./pages/VotingPage";
import ResultsPage from "./pages/ResultsPage";
import ResultsRevealPage from "./pages/ResultsRevealPage";
import ThankYouPage from "./pages/ThankYouPage";
import AdminPage from "./pages/AdminPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import Footer from "./components/layout/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/vote" element={<VotingPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/results/:categoryId" element={<ResultsRevealPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    
    </BrowserRouter>
    
  );
}
