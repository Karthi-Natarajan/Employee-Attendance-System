import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";
import "../../styles.css";

function EmployeeDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [role, setRole] = useState("employee");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get("/auth/me");
        setRole(userRes.data.role);

        const attendanceRes = await api.get("/dashboard/employee");
        setDashboard(attendanceRes.data);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <Navbar role={role} />
        <div className="container">
          <p className="loading">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <Navbar role={role} />
        <div className="container">
          <p className="alert alert-error">{error}</p>
        </div>
      </div>
    );
  }

  const todayRecord = dashboard?.todayStatus || null;

  const handleCheckIn = async () => {
    try {
      await api.post("/attendance/checkin");
      const res = await api.get("/dashboard/employee");
      setDashboard(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to check in");
      console.error(err);
    }
  };

  const handleCheckOut = async () => {
    try {
      await api.post("/attendance/checkout");
      const res = await api.get("/dashboard/employee");
      setDashboard(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to check out");
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'present': return 'status-present';
      case 'late': return 'status-late';
      case 'absent': return 'status-absent';
      default: return '';
    }
  };

  return (
    <div className="page">
      <Navbar role={role} />
      <div className="container">
        <div className="dashboard-wrapper">
          <div className="dashboard-header">
            <div className="header-content">
              <button
                className="btn-back"
                onClick={() => {
                  if (window.history.length > 1) navigate(-1);
                  else navigate('/');
                }}
              >
                ← Back
              </button>
              <div>
                <h1>Welcome Back!</h1>
                <p className="header-subtitle">Manage your attendance and view your status</p>
              </div>
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="dashboard-grid">
            {/* Status Card */}
            <div className={`dashboard-card status-card ${getStatusColor(todayRecord?.status)}`}>
              <div className="card-icon">
                <span className="status-emoji">
                  {todayRecord?.status === 'present' && '✓'}
                  {todayRecord?.status === 'late' && '⏰'}
                  {todayRecord?.status === 'absent' && '×'}
                  {!todayRecord?.status && '—'}
                </span>
              </div>
              <div className="card-content">
                <p className="card-label">Status</p>
                <p className="card-value">
                  {todayRecord?.status ? (
                    <span className={`status-badge ${getStatusColor(todayRecord.status)}`}>
                      {todayRecord.status.charAt(0).toUpperCase() + todayRecord.status.slice(1)}
                    </span>
                  ) : '-'}
                </p>
              </div>
            </div>

            {/* Date Card */}
            <div className="dashboard-card date-card">
              <div className="card-icon">📅</div>
              <div className="card-content">
                <p className="card-label">Date</p>
                <p className="card-value">
                  {todayRecord?.date
                    ? new Date(todayRecord.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })
                    : '-'}
                </p>
              </div>
            </div>

            {/* Check In Card */}
            <div className="dashboard-card checkin-card">
              <div className="card-icon">🔵</div>
              <div className="card-content">
                <p className="card-label">Check In</p>
                <p className="card-value time">
                  {todayRecord?.checkInTime ? todayRecord.checkInTime : '-'}
                </p>
              </div>
            </div>

            {/* Check Out Card */}
            <div className="dashboard-card checkout-card">
              <div className="card-icon">🔴</div>
              <div className="card-content">
                <p className="card-label">Check Out</p>
                <p className="card-value time">
                  {todayRecord?.checkOutTime ? todayRecord.checkOutTime : '-'}
                </p>
              </div>
            </div>

            {/* Hours Card */}
            <div className="dashboard-card hours-card">
              <div className="card-icon">⏱️</div>
              <div className="card-content">
                <p className="card-label">Hours Worked</p>
                <p className="card-value">
                  {todayRecord?.totalHours ?? 0}
                  <span className="unit"> hrs</span>
                </p>
              </div>
            </div>

            {/* Actions Card */}
            <div className="dashboard-card actions-card">
              <div className="card-icon">⚡</div>
              <div className="card-content">
                <p className="card-label">Actions</p>
                <div className="action-buttons">
                  <button onClick={handleCheckIn} className="btn btn-check-in">
                    Check In
                  </button>
                  <button onClick={handleCheckOut} className="btn btn-check-out">
                    Check Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
