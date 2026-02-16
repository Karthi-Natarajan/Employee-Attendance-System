const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  employeeDashboard,
  managerDashboard
} = require("../controllers/dashboardController");

router.get("/employee", authMiddleware, employeeDashboard);
router.get("/manager", authMiddleware, managerDashboard);

module.exports = router;
