import { Link, useNavigate } from "react-router-dom";
import "../styles.css";

function Navbar({ role }) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Attendance System
        </Link>

        <div className="nav-links">
          {role === "employee" && (
            <>
              <Link to="/employee/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/employee/my-attendance" className="nav-link">
                My Attendance
              </Link>
              <Link to="/employee/profile" className="nav-link">
                Profile
              </Link>
            </>
          )}

          {role === "manager" && (
            <>
              <Link to="/manager/dashboard" className="nav-link">
                Dashboard
              </Link>

              {/* ✅ FIXED HERE */}
              <Link to="/manager/attendance" className="nav-link">
                All Attendance
              </Link>

              <Link to="/manager/reports" className="nav-link">
                Reports
              </Link>
            </>
          )}

          <button onClick={handleLogout} className="btn btn-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
