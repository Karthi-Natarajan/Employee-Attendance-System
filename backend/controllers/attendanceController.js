const Attendance = require("../models/Attendance");
const User = require("../models/User");

// helpers
const todayDate = () => new Date().toISOString().split("T")[0];
const nowTime = () => new Date().toLocaleTimeString();

/* ========= CHECK IN ========= */
const checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = todayDate();

    const already = await Attendance.findOne({ userId, date: today });
    if (already) {
      return res.status(400).json({ message: "Already checked in" });
    }

    const now = new Date();
    const lateLimit = new Date();
    lateLimit.setHours(9, 30, 0);

    const status = now > lateLimit ? "late" : "present";

    const record = await Attendance.create({
      userId,
      date: today,
      checkInTime: nowTime(),
      status,
    });

    res.status(201).json({ message: "Checked in", record });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ========= CHECK OUT ========= */
const checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = todayDate();

    const record = await Attendance.findOne({ userId, date: today });
    if (!record) {
      return res.status(400).json({ message: "No check-in today" });
    }

    if (record.checkOutTime) {
      return res.status(400).json({ message: "Already checked out" });
    }

    const out = new Date();
    const inTime = new Date(`${today} ${record.checkInTime}`);
    const hours = Math.round(((out - inTime) / 3600000) * 100) / 100;

    record.checkOutTime = nowTime();
    record.totalHours = hours;
    await record.save();

    res.json({ message: "Checked out", record });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ========= TODAY STATUS (EMPLOYEE) ========= */
const getTodayStatus = async (req, res) => {
  try {
    const record = await Attendance.findOne({
      userId: req.user.id,
      date: todayDate(),
    });

    if (!record) {
      return res.json({ checkedIn: false });
    }

    res.json({
      checkedIn: true,
      status: record.status,
      checkInTime: record.checkInTime,
      checkOutTime: record.checkOutTime || null,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/* ========= MY ATTENDANCE ========= */
const getMyAttendance = async (req, res) => {
  try {
    const data = await Attendance.find({ userId: req.user.id })
      .sort({ date: -1 });

    res.json(data);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/* ========= MY MONTH SUMMARY ========= */
const getMySummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).json({ message: "Month & year required" });
    }

    const start = `${year}-${month.padStart(2, "0")}-01`;
    const end = `${year}-${month.padStart(2, "0")}-31`;

    const records = await Attendance.find({
      userId: req.user.id,
      date: { $gte: start, $lte: end },
    });

    const summary = {
      present: 0,
      absent: 0,
      late: 0,
      halfDay: 0,
      totalHours: 0,
    };

    records.forEach(r => {
      summary[r.status] = (summary[r.status] || 0) + 1;
      summary.totalHours += r.totalHours || 0;
    });

    summary.totalHours = Number(summary.totalHours.toFixed(2));
    res.json(summary);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/* ========= ALL ATTENDANCE (MANAGER) ========= */
const getAllAttendance = async (req, res) => {
  if (req.user.role !== "manager") {
    return res.status(403).json({ message: "Access denied" });
  }

  const data = await Attendance.find()
    .populate("userId", "name email employeeId department")
    .sort({ date: -1 });

  res.json(data);
};

/* ========= SINGLE EMPLOYEE (MANAGER) ========= */
const getEmployeeAttendance = async (req, res) => {
  if (req.user.role !== "manager") {
    return res.status(403).json({ message: "Access denied" });
  }

  const data = await Attendance.find({ userId: req.params.id })
    .sort({ date: -1 });

  res.json(data);
};

/* ========= TODAY TEAM STATUS (MANAGER) ========= */
const getTodayTeamStatus = async (req, res) => {
  if (req.user.role !== "manager") {
    return res.status(403).json({ message: "Access denied" });
  }

  const data = await Attendance.find({ date: todayDate() })
    .populate("userId", "name employeeId");

  res.json(data);
};

/* ========= TEAM SUMMARY (MANAGER) ========= */
const getTeamSummary = async (req, res) => {
  if (req.user.role !== "manager") {
    return res.status(403).json({ message: "Access denied" });
  }

  const today = todayDate();
  const totalEmployees = await User.countDocuments({ role: "employee" });
  const todayRecords = await Attendance.find({ date: today });

  res.json({
    totalEmployees,
    present: todayRecords.filter(r => r.status === "present").length,
    late: todayRecords.filter(r => r.status === "late").length,
    absent: totalEmployees - todayRecords.length,
  });
};

const exportAttendanceCSV = async (req, res) => {
  if (req.user.role !== "manager") {
    return res.status(403).json({ message: "Access denied" });
  }

  const { start, end, employeeId } = req.query;

  const filter = {};
  if (start && end) filter.date = { $gte: start, $lte: end };
  if (employeeId) filter.userId = employeeId;

  const records = await Attendance.find(filter).populate(
    "userId",
    "name employeeId department"
  );

  let csv = "Employee ID,Name,Date,Status,CheckIn,CheckOut,Hours\n";

  records.forEach(r => {
    csv += `${r.userId.employeeId},${r.userId.name},${r.date},${r.status},${r.checkInTime || ""},${r.checkOutTime || ""},${r.totalHours || 0}\n`;
  });

  res.header("Content-Type", "text/csv");
  res.attachment("attendance.csv");
  res.send(csv);
};

module.exports = {
  checkIn,
  checkOut,
  getTodayStatus,
  getMyAttendance,
  getMySummary,
  getAllAttendance,
  getEmployeeAttendance,
  getTodayTeamStatus,
  getTeamSummary,
  exportAttendanceCSV,
};
