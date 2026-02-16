import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles.css";

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* LEFT PANEL */}
        <div className="auth-left">
          <div className="auth-branding">
            <div className="brand-icon">📊</div>
            <h1>Attendance Tracker</h1>
            <p>Smart & secure employee attendance system</p>
          </div>

          <div className="auth-features">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              Real-time attendance tracking
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              Role-based access control
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              Manager analytics & reports
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="auth-right">
          <div className="auth-card">
            <div className="auth-header">
              <h2>Create Account</h2>
              <p>Register to access the system</p>
            </div>

            {error && (
              <div className="alert alert-error">
                <span className="error-icon">⚠</span>
                {error}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>FULL NAME</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    className="form-input"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>EMAIL</label>
                <div className="input-wrapper">
                  <span className="input-icon">✉️</span>
                  <input
                    className="form-input"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>PASSWORD</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    className="form-input"
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>ROLE</label>
                <div className="input-wrapper">
                  <select
                    className="form-input"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
              </div>

              <button className="btn-login" disabled={loading}>
                {loading ? (
                  <span className="spinner">⏳</span>
                ) : (
                  <>
                    Register <span className="btn-arrow">→</span>
                  </>
                )}
              </button>
            </form>

            <p className="auth-link">
              Already have an account? <Link to="/login">Login here</Link>
            </p>

            <div className="auth-footer">
              <p>Built for Tap Academy SDE Internship</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
