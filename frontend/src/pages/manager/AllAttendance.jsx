import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";
import "../../styles.css";

function AllAttendance() {
  const [records, setRecords] = useState([]);
  const [role, setRole] = useState("manager");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get("/auth/me");
        setRole(userRes.data.role);

        const attendanceRes = await api.get("/attendance/all");
        setRecords(attendanceRes.data || []);
      } catch (err) {
        setError("Failed to load attendance records");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredRecords = filterStatus === "all"
    ? records
    : records.filter((r) => r.status?.toLowerCase() === filterStatus.toLowerCase());

  const navigate = useNavigate();

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
          <p className="error-message">{error}</p>
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
            <button className="btn-back" onClick={() => navigate(-1)}>Back</button>
            <h2>All Attendance Records</h2>
          </div>

          <div className="filter-group">
            <label>Filter by Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
            </select>
          </div>

          {filteredRecords.length === 0 ? (
            <p className="empty-message">No attendance records found.</p>
          ) : (
            <div className="table-wrapper">
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => {
                    // helpers to safely format date/time strings coming from backend
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
                        <td>{record.userId?.name || "Unknown"}</td>
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

export default AllAttendance;
