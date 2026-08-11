import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLessonPlansPage from "./pages/AdminLessonPlansPage";
import UserManagement from "./pages/UserManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import GeneratePlanPage from "./pages/GeneratePlanPage";
import PreviewPage from "./pages/PreviewPage";
import InfoPage from "./pages/InfoPage";
import SupportDonationPage from "./pages/SupportDonationPage";
import DashboardPage from "./pages/DashboardPage";
import RefineLessonPage from "./pages/RefineLessonPage";
import DiscoverPage from "./pages/DiscoverPage";
import PageProgressBar from "./components/PageProgressBar";

function App() {
  return (
    <BrowserRouter>
      <PageProgressBar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/privacy-policy" element={<InfoPage page="privacy" />} />
        <Route path="/support" element={<SupportDonationPage />} />
        <Route
          path="/terms-and-conditions"
          element={<InfoPage page="terms" />}
        />
        <Route path="/about" element={<InfoPage page="about" />} />

        {/* Teacher Routes — no auth required */}
        <Route
          path="/"
          element={
            <GuestRoute>
              <DashboardPage />
            </GuestRoute>
          }
        />
        <Route
          path="/generate"
          element={
            <GuestRoute>
              <GeneratePlanPage />
            </GuestRoute>
          }
        />
        <Route
          path="/discover"
          element={
            <GuestRoute>
              <DiscoverPage />
            </GuestRoute>
          }
        />
        <Route
          path="/preview/:id"
          element={
            <GuestRoute>
              <PreviewPage />
            </GuestRoute>
          }
        />
        <Route
          path="/refine/:id"
          element={
            <GuestRoute>
              <RefineLessonPage />
            </GuestRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/lesson-plans"
          element={
            <ProtectedRoute>
              <AdminLessonPlansPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
