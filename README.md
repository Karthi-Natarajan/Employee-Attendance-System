## Candidate Details

- **Name:** Karthi Natarajan  
- **College:** Vel Tech High Tech Dr. Rangarajan Dr. Sakunthala Engineering College  
- **contact:** skarthinatarajan21@gmail.com
- **Phone no:** 9360253194
- **project preview url:** https://employee-attendance-system-blond.vercel.app/ 

-----------------------------------------------------------------------------------------

# Attendance Tracking System

A modern, full-stack attendance management system with role-based access control (Employee & Manager). Built with React, Node.js/Express, and MongoDB.

## Features

### Employee Features
- ✅ User registration & login
- ✅ Mark daily attendance (Check In / Check Out)
- ✅ View attendance history (table & calendar view)
- ✅ Monthly attendance summary (Present/Late/Absent days)
- ✅ Dashboard with today's status and quick stats
- ✅ View and edit profile

### Manager Features
- ✅ Login & dashboard
- ✅ View all employees' attendance
- ✅ Filter attendance by employee, date, status
- ✅ Detailed team attendance summary
- ✅ Generate attendance reports
- ✅ Export attendance to CSV
- ✅ Team dashboard with key metrics

## Tech Stack

### Frontend
- **React** 19.2.0 - UI framework
- **React Router DOM** 7.13.0 - Client-side routing
- **Axios** 1.13.5 - HTTP client
- **Vite** 7.3.1 - Build tool

### Backend
- **Node.js** - Runtime
- **Express** 5.2.1 - Web framework
- **MongoDB** 9.2.1 - Database
- **JWT** - Authentication
- **Bcryptjs** - Password hashing

## Project Structure

```
TapAcademyHackathon/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js              # Axios instance with interceptors
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── useAuth.js             # Auth custom hook
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Calendar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── employee/
│   │   │   │   ├── EmployeeDashboard.jsx
│   │   │   │   ├── MyAttendance.jsx
│   │   │   │   └── Profile.jsx
│   │   │   └── manager/
│   │   │       ├── ManagerDashboard.jsx
│   │   │       ├── AllAttendance.jsx
│   │   │       └── Reports.jsx
│   │   ├── styles.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── backend/
    ├── config/
    │   └── db.js                      # MongoDB connection
    ├── controllers/
    │   ├── authController.js
    │   ├── attendanceController.js
    │   └── dashboardController.js
    ├── middleware/
    │   └── authMiddleware.js          # JWT verification
    ├── models/
    │   ├── User.js
    │   └── Attendance.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── attendanceRoutes.js
    │   └── dashboardRoutes.js
    ├── server.js
    ├── seed.js                        # Sample data seeding
    ├── .env
    ├── .env.example
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js 16+ & npm/yarn
- MongoDB Atlas account or local MongoDB instance
- Git

### Backend Setup

1. **Clone & Navigate**
```bash
cd backend
npm install
```

2. **Configure Environment**
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

3. **Seed Sample Data**
```bash
node seed.js
```

4. **Start Backend Server**
```bash
npm run dev
# Server runs on http://localhost:5000
```

### Frontend Setup

1. **Navigate to Frontend**
```bash
cd ../frontend
npm install
```

2. **Start Development Server**
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

3. **Build for Production**
```bash
npm run build
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Attendance (Employee)
- `POST /api/attendance/checkin` - Check in
- `POST /api/attendance/checkout` - Check out
- `GET /api/attendance/my-history` - Attendance history
- `GET /api/attendance/my-summary` - Monthly summary
- `GET /api/attendance/today` - Today's status

### Attendance (Manager)
- `GET /api/attendance/all` - All employees' attendance
- `GET /api/attendance/employee/:id` - Specific employee's records
- `GET /api/attendance/summary` - Team summary
- `GET /api/attendance/today-status` - Who's present today
- `GET /api/attendance/export` - Export CSV

### Dashboard
- `GET /api/dashboard/employee` - Employee dashboard stats
- `GET /api/dashboard/manager` - Manager dashboard stats

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "employee" | "manager",
  employeeId: String (unique),
  department: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Attendance Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  date: String (YYYY-MM-DD),
  checkInTime: String (HH:MM),
  checkOutTime: String (HH:MM),
  status: "present" | "late" | "absent",
  totalHours: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Test Credentials

After running `seed.js`, use these credentials:

**Employee Account**
- Email: `john@example.com`
- Password: `password123`

**Manager Account**
- Email: `bob@example.com`
- Password: `password123`

## Key Features Explained

### Check In/Out System
- Employees can mark check-in time on arrival
- Check-out time recorded when leaving
- System automatically calculates total hours worked
- Late arrivals after 9:00 AM marked as "Late"
- Missing check-in marked as "Absent"

### Calendar View
- Visual calendar showing attendance status
- Color-coded: Green (Present), Yellow (Late), Red (Absent)
- Click dates to see detailed records
- Monthly navigation with "Today" button

### Reports & Export
- Generate reports for custom date ranges
- Filter by employee or all team members
- Export data to CSV for analysis
- Includes check-in/out times and status

### Responsive Design
- Mobile-friendly interface
- Works on desktop, tablet, and phone
- Touch-optimized buttons and navigation
- Adaptive grid layouts

## Browser Support

- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)

## Performance Optimizations

- JWT token-based authentication
- Request/Response interceptors for error handling
- Optimized API calls with proper caching
- CSS Grid for responsive layouts
- Lazy loading for heavy components

## Security Features

- Password hashing with bcryptjs
- JWT token verification on protected routes
- CORS enabled with controlled origins
- Protected API endpoints with middleware
- Environment variables for sensitive data

## Future Enhancements

- [ ] Role-based dashboards with charts (Chart.js/D3.js)
- [ ] Email notifications for check-in/out
- [ ] Biometric/QR code check-in support
- [ ] Leave management system
- [ ] WhatsApp/SMS notifications
- [ ] Advanced analytics and reporting
- [ ] Geolocation-based check-in
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Mobile app (React Native)

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

This project is open source and available under the MIT License.

## Contact & Support

For issues, questions, or contributions, please open an GitHub issue or contact the development team.

---

**Built with ❤️ for efficient attendance management**
