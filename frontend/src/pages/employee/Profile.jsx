import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import Navbar from '../../components/Navbar';
import '../../styles.css';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('employee');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const res = await axios.get('/auth/me');
      console.log('Auth response:', res.data);
      const userData = res.data.user || res.data;
      setUser(userData);
      setRole(userData.role || 'employee');
      setFormData(userData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user:', err);
      setError(err.response?.data?.message || 'Failed to load profile');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      console.log('Saving profile with data:', formData);
      const response = await axios.put('/auth/update', {
        name: formData.name,
        email: formData.email,
        department: formData.department
      });
      
      console.log('Profile update response:', response.data);
      setUser(response.data.user);
      setFormData(response.data.user);
      setEditMode(false);
      setError('');
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Update error details:', {
        status: err.response?.status,
        message: err.response?.data?.message,
        data: err.response?.data,
        error: err.message
      });
      setError(err.response?.data?.message || 'Failed to update profile. Check console for details.');
    }
  };

  if (loading) return (
    <div className="page">
      <Navbar role={role} />
      <div className="container">
        <p className="loading">Loading profile...</p>
      </div>
    </div>
  );

  return (
    <div className="page">
      <Navbar role={role} />
      <div className="container">
        <div className="card profile-card">
          <div className="card-header">
            <h2>My Profile</h2>
            <button
              className="btn-back"
              onClick={() => {
                if (window.history.length > 1) navigate(-1);
                else navigate('/employee/dashboard');
              }}
            >
              Back
            </button>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {!editMode ? (
            <div className="profile-view">
              <div className="profile-field">
                <label>Full Name</label>
                <p className="profile-value">{user?.name}</p>
              </div>
              <div className="profile-field">
                <label>Email</label>
                <p className="profile-value">{user?.email}</p>
              </div>
              <div className="profile-field">
                <label>Employee ID</label>
                <p className="profile-value">{user?.employeeId || 'Not assigned'}</p>
              </div>
              <div className="profile-field">
                <label>Department</label>
                <p className="profile-value">{user?.department || 'Not assigned'}</p>
              </div>
              <div className="profile-field">
                <label>Role</label>
                <p className="profile-value">
                  <span className={`badge badge-${user?.role}`}>
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                  </span>
                </p>
              </div>
              <div style={{ marginTop: '20px' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={() => setEditMode(true)}
                  style={{ width: '150px' }}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-edit">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="button-group">
                <button className="btn btn-primary" onClick={handleSave}>
                  Save
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditMode(false);
                    setFormData(user);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
