const Attendance = require("../models/Attendance");
const User = require("../models/User");

const todayDate = () => new Date().toISOString().split("T")[0];

/* ========= EMPLOYEE DASHBOARD ========= */
const employeeDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = todayDate();

    const todayRecord = await Attendance.findOne({ userId, date: today });

    const month = today.slice(5, 7);
    const year = today.slice(0, 4);

    const start = `${year}-${month}-01`;
    const end = `${year}-${month}-31`;

    const monthRecords = await Attendance.find({
      userId,
      date: { $gte: start, $lte: end },
    });

    const summary = {
      present: 0,
      absent: 0,
      late: 0,
      halfDay: 0,
      totalHours: 0,
    };

    monthRecords.forEach(r => {
      summary[r.status] = (summary[r.status] || 0) + 1;
      summary.totalHours += r.totalHours || 0;
    });

    const recent = await Attendance.find({ userId })
      .sort({ date: -1 })
      .limit(7);

    res.json({
      todayStatus: todayRecord || null,
      monthlySummary: {
        ...summary,
        totalHours: Number(summary.totalHours.toFixed(2)),
      },
      recentAttendance: recent,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/* ========= MANAGER DASHBOARD ========= */
const managerDashboard = async (req, res) => {
  try {
    const today = todayDate();

    const totalEmployees = await User.countDocuments({ role: "employee" });
    const todayRecords = await Attendance.find({ date: today }).populate(
      "userId",
      "name employeeId"
    );

    const present = todayRecords.filter(r => r.status === "present").length;
    const late = todayRecords.filter(r => r.status === "late").length;
    const absent = totalEmployees - todayRecords.length;

    const absentEmployees = await User.find({
      role: "employee",
      _id: { $nin: todayRecords.map(r => r.userId._id) },
    }).select("name employeeId");

    res.json({
      totalEmployees,
      present,
      late,
      absent,
      absentEmployees,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  employeeDashboard,
  managerDashboard,
};
