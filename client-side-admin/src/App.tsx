import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/UserManagement";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ResetPasswordSuccessPage from "./pages/ResetPasswordSuccessPage";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProtectedRoute from "./components/UserProtectedRoute";
import UserLoginPage from "./pages/UserLoginPage";
import UserRegisterPage from "./pages/UserRegisterPage";
import GeneratePlanPage from "./pages/GeneratePlanPage";
import HistoryPage from "./pages/HistoryPage";
import PreviewPage from "./pages/PreviewPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />

        {/* User Routes */}
        <Route path="/login" element={<UserLoginPage />} />
        <Route path="/register" element={<UserRegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/reset-password-success"
          element={<ResetPasswordSuccessPage />}
        />
        <Route
          path="/generate"
          element={
            <UserProtectedRoute>
              <GeneratePlanPage />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <UserProtectedRoute>
              <HistoryPage />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/preview/:id"
          element={
            <UserProtectedRoute>
              <PreviewPage />
            </UserProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin/forgot-password"
          element={<Navigate to="/forgot-password" replace />}
        />
        <Route
          path="/admin/reset-password"
          element={<Navigate to="/reset-password" replace />}
        />
        <Route
          path="/admin/reset-password-success"
          element={<Navigate to="/reset-password-success" replace />}
        />
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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
