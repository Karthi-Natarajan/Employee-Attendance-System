import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

const formatDateForInput = (date) => {
  if (!date) return '';
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }
  if (typeof date === 'string' && date.includes('-')) {
    return date.split('T')[0];
  }
  return '';
};

const formatTime = (time) => {
  if (!time) return '-';
  try {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch {
    return time;
  }
};

export default function Reports() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
    // Set default date range to current month
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    setStartDate(formatDateForInput(firstDay));
    setEndDate(formatDateForInput(now));
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('/attendance/all');
      const uniqueEmployees = [];
      const seen = new Set();
      res.data.forEach(record => {
        if (!seen.has(record.user?._id)) {
          uniqueEmployees.push(record.user);
          seen.add(record.user?._id);
        }
      });
      setEmployees(uniqueEmployees);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  };

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }
    try {
      setError('');
      setLoading(true);
      const params = {
        startDate,
        endDate,
        ...(selectedEmployee && { employeeId: selectedEmployee })
      };
      const res = await axios.get('/attendance/all', { params });
      
      // Filter by date range
      const filtered = res.data.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= new Date(startDate) && recordDate <= new Date(endDate);
      });
      
      setData(filtered);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate report');
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = ['Date', 'Employee', 'Check In', 'Check Out', 'Status', 'Total Hours'];
    const rows = data.map(record => [
      new Date(record.date).toLocaleDateString(),
      record.user?.name || 'Unknown',
      record.checkInTime || '-',
      record.checkOutTime || '-',
      record.status || '-',
      record.totalHours || '-'
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${startDate}-to-${endDate}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="container">
      <div className="card reports-card">
        <div className="card-header">
          <h2>Attendance Reports</h2>
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

        {error && <div className="alert alert-error">{error}</div>}

        <div className="reports-filters">
          <div className="filter-group">
            <label>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="filter-group">
            <label>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="filter-group">
            <label>Employee (Optional)</label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="form-control"
            >
              <option value="">All Employees</option>
              {employees.map(emp => (
                <option key={emp?._id} value={emp?._id}>
                  {emp?.name}
                </option>
              ))}
            </select>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleGenerateReport}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
          {data.length > 0 && (
            <button
              className="btn btn-success"
              onClick={handleExportCSV}
            >
              Export to CSV
            </button>
          )}
        </div>

        {data.length > 0 && (
          <div className="reports-table">
            <h3>Report Results ({data.length} records)</h3>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Employee</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                  <th>Hours</th>
                </tr>
              </thead>
              <tbody>
                {data.map((record, idx) => (
                  <tr key={idx}>
                    <td>{new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td>{record.user?.name || 'Unknown'}</td>
                    <td>{formatTime(record.checkInTime)}</td>
                    <td>{formatTime(record.checkOutTime)}</td>
                    <td>
                      <span className={`status-badge status-${record.status}`}>
                        {record.status?.charAt(0).toUpperCase() + record.status?.slice(1)}
                      </span>
                    </td>
                    <td>{record.totalHours ? `${record.totalHours.toFixed(1)}h` : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && data.length === 0 && startDate && (
          <div className="alert alert-info">
            Click "Generate Report" to see attendance data for the selected date range.
          </div>
        )}
      </div>
    </div>
  );
}
