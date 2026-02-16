import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./auth/Login";
import Register from "./auth/Register";
import ProtectedRoute from "./components/ProtectedRoute";

// Employee pages
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import MyAttendance from "./pages/employee/MyAttendance";
import Profile from "./pages/employee/Profile";

// Manager pages
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import AllAttendance from "./pages/manager/AllAttendance";
import Reports from "./pages/manager/Reports";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Employee */}
        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/my-attendance"
          element={
            <ProtectedRoute>
              <MyAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Manager */}
        <Route
          path="/manager/dashboard"
          element={
            <ProtectedRoute>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/attendance"
          element={
            <ProtectedRoute>
              <AllAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
