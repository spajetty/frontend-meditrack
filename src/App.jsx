import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import LandingLayout from "./layouts/LandingLayout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import Profile from "./pages/Profile";
import Prescription from "./pages/Prescription";
import TodayPrescription from "./pages/TodayPrescription";
import Patient from "./pages/Patient";
import HowToUse from "./pages/HowToUse";
import DashboardLayout from "./layouts/DashboardLayout";
import MedicationHistory from './pages/MedicationHistory';
import DoctorMedicationSummary from './pages/DoctorMedicationSummary';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingLayout><LandingPage /></LandingLayout>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Patient routes */}
          <Route
            path="/patient-dashboard"
            element={
              <ProtectedRoute role="patient">
                <DashboardLayout><PatientDashboard /></DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/prescriptions"
            element={
              <ProtectedRoute role="patient">
                <DashboardLayout><Prescription /></DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/today-prescriptions"
            element={
              <ProtectedRoute role="patient">
                <DashboardLayout><TodayPrescription /></DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <DashboardLayout><Profile /></DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/how-to-use"
            element={
              <ProtectedRoute>
                <DashboardLayout><HowToUse /></DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Doctor routes */}
          <Route
            path="/doctor-dashboard"
            element={
              <ProtectedRoute role="doctor">
                <DashboardLayout><DoctorDashboard /></DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients"
            element={
              <ProtectedRoute role="doctor">
                <DashboardLayout><Patient /></DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
          path="/medication-history/:patientId"
          element={
            <ProtectedRoute role="doctor">
              <DashboardLayout><MedicationHistory /></DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor-medication-summary/:patientId"
          element={
            <ProtectedRoute role="doctor">
              <DashboardLayout><DoctorMedicationSummary /></DashboardLayout>
            </ProtectedRoute>
          }
        />
        
 
        </Routes>
          
        
          
      </BrowserRouter>
    </AuthProvider>
  );
}
