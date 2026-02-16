import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";
import Calendar from "../../components/Calendar";
import "../../styles.css";

function MyAttendance() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [role, setRole] = useState("employee");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("calendar"); // calendar or table

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get("/auth/me");
        setRole(userRes.data.role);

        const historyRes = await api.get("/attendance/my-history");
        setRecords(historyRes.data || []);
      } catch (err) {
        setError("Failed to load attendance records");
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
          <p className="loading">Loading attendance records...</p>
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

  return (
    <div className="page">
      <Navbar role={role} />
      <div className="container">
        <div className="card">
          <div className="card-header">
            <h2>My Attendance Records</h2>
            <button
              className="btn-back"
              onClick={() => {
                if (window.history.length > 1) navigate(-1);
                else navigate('/');
              }}
            >
              Back
            </button>
          </div>

          <div className="mb-3" style={{ display: 'flex', gap: '10px' }}>
            <button 
              className={`btn ${viewMode === 'calendar' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('calendar')}
            >
              Calendar View
            </button>
            <button 
              className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('table')}
            >
              Table View
            </button>
          </div>

          {records.length === 0 ? (
            <p className="empty-state">No attendance records found.</p>
          ) : viewMode === 'calendar' ? (
            <Calendar />
          ) : (
            <div className="table-wrapper">
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Check In Time</th>
                    <th>Check Out Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => {
                    const formatDate = (val) => {
                      if (!val) return "-";
                      const d = new Date(val);
                      if (!isNaN(d)) return d.toLocaleDateString();
                      return String(val);
                    };

                    const formatTime = (timeVal, dateVal) => {
                      if (!timeVal) return "-";
                      const tryParse = (s) => {
                        const dd = new Date(s);
                        return isNaN(dd) ? null : dd;
                      };

                      let dt = tryParse(timeVal);
                      if (!dt && dateVal) dt = tryParse(`${dateVal}T${timeVal}`) || tryParse(`${dateVal} ${timeVal}`);
                      if (dt) return dt.toLocaleTimeString();
                      return String(timeVal);
                    };

                    return (
                      <tr key={record._id} className={`status-${record.status?.toLowerCase()}`}>
                        <td>{formatDate(record.date)}</td>
                        <td>{formatTime(record.checkInTime, record.date)}</td>
                        <td>{formatTime(record.checkOutTime, record.date)}</td>
                        <td>
                          <span className={`badge badge-${record.status?.toLowerCase()}`}>
                            {record.status || "-"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyAttendance;
