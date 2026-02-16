import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";
import "../../styles.css";

function ManagerDashboard() {
  const [data, setData] = useState(null);
  const [role, setRole] = useState("manager");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get("/auth/me");
        setRole(userRes.data.role);

        const dashboardRes = await api.get("/dashboard/manager");
        setData(dashboardRes.data);
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

  const presentPercentage = data?.totalEmployees ? Math.round((data.present / data.totalEmployees) * 100) : 0;
  const absentPercentage = data?.totalEmployees ? Math.round((data.absent / data.totalEmployees) * 100) : 0;

  return (
    <div className="page">
      <Navbar role={role} />
      <div className="container">
        <div className="dashboard-wrapper">
          <div className="dashboard-header">
            <div className="header-content">
              <button className="btn-back" onClick={() => navigate(-1)}>
                ← Back
              </button>
              <div>
                <h1>Manager Dashboard</h1>
                <p className="header-subtitle">Monitor team attendance and overview</p>
              </div>
            </div>
          </div>

          <div className="manager-stats-grid">
            {/* Total Employees */}
            <div className="manager-stat-card total-card">
              <div className="stat-icon">👥</div>
              <div className="stat-details">
                <p className="stat-label">Total Employees</p>
                <p className="stat-amount">{data?.totalEmployees || 0}</p>
              </div>
              <div className="stat-accent"></div>
            </div>

            {/* Present Today */}
            <div className="manager-stat-card present-card">
              <div className="stat-icon">✓</div>
              <div className="stat-details">
                <p className="stat-label">Present Today</p>
                <p className="stat-amount">{data?.present || 0}</p>
                <div className="stat-progress">
                  <div 
                    className="progress-bar present-progress" 
                    style={{ width: `${presentPercentage}%` }}
                  ></div>
                </div>
                <p className="stat-percentage">{presentPercentage}%</p>
              </div>
              <div className="stat-accent present-accent"></div>
            </div>

            {/* Absent Today */}
            <div className="manager-stat-card absent-card">
              <div className="stat-icon">×</div>
              <div className="stat-details">
                <p className="stat-label">Absent Today</p>
                <p className="stat-amount">{data?.absent || 0}</p>
                <div className="stat-progress">
                  <div 
                    className="progress-bar absent-progress" 
                    style={{ width: `${absentPercentage}%` }}
                  ></div>
                </div>
                <p className="stat-percentage">{absentPercentage}%</p>
              </div>
              <div className="stat-accent absent-accent"></div>
            </div>
          </div>

          <div className="quick-actions-section">
            <h2>Quick Actions</h2>
            <div className="quick-actions-grid">
              <button className="action-btn reports-btn" onClick={() => navigate('/manager/reports')}>
                <span className="action-icon">📊</span>
                <span>View Reports</span>
              </button>
              <button className="action-btn attendance-btn" onClick={() => navigate('/manager/attendance')}>
                <span className="action-icon">📋</span>
                <span>Check Attendance</span>
              </button>
              <button className="action-btn profile-btn" onClick={() => navigate('/manager/profile')}>
                <span className="action-icon">👤</span>
                <span>My Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;
