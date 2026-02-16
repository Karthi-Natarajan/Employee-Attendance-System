import { useEffect, useState } from 'react';
import axios from '../api/axios';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar({ employeeId = null }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, [currentDate, employeeId]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      let res;
      if (employeeId) {
        res = await axios.get(`/attendance/employee/${employeeId}`);
      } else {
        res = await axios.get('/attendance/my-history');
      }

      const map = {};
      res.data.forEach(record => {
        const dateStr = new Date(record.date).toISOString().split('T')[0];
        map[dateStr] = record.status || 'present';
      });
      setAttendance(map);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  // Empty cells before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Days of month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getStatusClass = (dateStr) => {
    const status = attendance[dateStr];
    return `cal-day cal-${status}` || 'cal-day';
  };

  const getStatusLabel = (status) => {
    return status?.charAt(0).toUpperCase() + status?.slice(1) || 'No Record';
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={handlePrevMonth} className="btn-nav">←</button>
        <h3>
          {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button onClick={handleNextMonth} className="btn-nav">→</button>
        <button onClick={handleToday} className="btn-today">Today</button>
      </div>

      {loading ? (
        <p className="loading">Loading calendar...</p>
      ) : (
        <>
          <div className="calendar-weekdays">
            {DAYS.map(day => (
              <div key={day} className="weekday">{day}</div>
            ))}
          </div>

          <div className="calendar-grid">
            {days.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="cal-empty"></div>;
              }

              const dateStr = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day
              ).toISOString().split('T')[0];

              const status = attendance[dateStr];

              return (
                <div
                  key={dateStr}
                  className={`${getStatusClass(dateStr)} ${status ? 'has-record' : ''}`}
                  title={status ? getStatusLabel(status) : 'No record'}
                >
                  <span>{day}</span>
                  {status && (
                    <div className="status-indicator" title={getStatusLabel(status)}>
                      •
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="calendar-legend">
            <div className="legend-item">
              <div className="cal-present"></div>
              <span>Present</span>
            </div>
            <div className="legend-item">
              <div className="cal-late"></div>
              <span>Late</span>
            </div>
            <div className="legend-item">
              <div className="cal-absent"></div>
              <span>Absent</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
