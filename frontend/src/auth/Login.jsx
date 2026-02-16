import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import "../styles.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loginRes = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", loginRes.data.token);

      const meRes = await api.get("/auth/me");

      if (meRes.data.role === "manager") {
        navigate("/manager/dashboard");
      } else {
        navigate("/employee/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-branding">
            <div className="brand-icon">📊</div>
            <h1>Attendance Tracker</h1>
            <p>A Simple System to Manage Daily Attendance</p>
          </div>
          <div className="auth-features">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Real-time check-in & check-out</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Clear attendance records and summaries</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Manager dashboard overview</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Secure role-based access</span>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-card">
            <div className="auth-header">
              <h2>Welcome Back</h2>
              <p>Sign in to your account</p>
            </div>

            {error && (
              <div className="alert alert-error">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="form-input"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-login" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner">⏳</span>
                    Logging in...
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>Don't have an account?</span>
            </div>

            <Link to="/register" className="btn btn-secondary btn-register">
              Create Account
            </Link>

            <div className="auth-footer">
              <p>Demo credentials: user@example.com / password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
