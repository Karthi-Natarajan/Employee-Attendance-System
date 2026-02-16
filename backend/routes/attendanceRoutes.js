const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  checkIn,
  checkOut,
  getTodayStatus,
  getMyAttendance,
  getMySummary,
  getAllAttendance,
  getEmployeeAttendance,
  getTodayTeamStatus,
  getTeamSummary,
  exportAttendanceCSV
} = require("../controllers/attendanceController");

router.post("/checkin", authMiddleware, checkIn);
router.post("/checkout", authMiddleware, checkOut);

router.get("/today", authMiddleware, getTodayStatus);
router.get("/my-history", authMiddleware, getMyAttendance);
router.get("/my-summary", authMiddleware, getMySummary);

router.get("/all", authMiddleware, getAllAttendance);
router.get("/employee/:id", authMiddleware, getEmployeeAttendance);
router.get("/today-status", authMiddleware, getTodayTeamStatus);
router.get("/summary", authMiddleware, getTeamSummary);
router.get("/export", authMiddleware, exportAttendanceCSV);

module.exports = router;
