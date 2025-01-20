import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";

import LoginForm from "./pages/Auth/Login";
import Auth from "./pages/Auth/Auth";
import SignUp from "./pages/Auth/SignUp";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Intro from "./pages/Home/Intro";
import CashBalanceSetup from "./pages/Home/PutCorrency";
import Manage from "./pages/Home/Manage";
import Dashboard from "./pages/Home/Dashboard";

import EditSaveing from "./pages/Home/Saving/EditSaving";
import SavingsGoalsList from "./pages/Home/Saving/SavingRecords";

import "aos/dist/aos.css";

import Sheet from "./pages/Home/Sheet/Sheet";
import PieChart from "./pages/Home/Components/PieForm";
import CalendarApp from "./pages/Home/Calender/Calendar";
import Ai from "./pages/Home/AI/Ai";

// Helper function to check authentication
const isAuthenticated = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const userId = userData?.user?._id;
  return userId && userId.length >= 24;
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

// Global Route Guard Component
const AuthGuard = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated() && location.pathname !== "/login") {
      // Redirect to login if not authenticated
      window.location.href = "/login";
    }
  }, [location]);

  return children;
};

function App() {
  return (
    <Router>
      <AuthGuard>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Intro />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Routes */}
          <Route
            path="/currency"
            element={
              <ProtectedRoute>
                <CashBalanceSetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage"
            element={
              <ProtectedRoute>
                <Manage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/charts-info/:category"
            element={
              <ProtectedRoute>
                <PieChart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saving"
            element={
              <ProtectedRoute>
                <EditSaveing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saving-tracker"
            element={
              <ProtectedRoute>
                <SavingsGoalsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <CalendarApp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sheet"
            element={
              <ProtectedRoute>
                <Sheet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai"
            element={
              <ProtectedRoute>
                <Ai />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthGuard>
    </Router>
  );
}

export default App;
