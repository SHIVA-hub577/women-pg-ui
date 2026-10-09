const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');

// Ultra-lightweight keep-alive ping for external cron monitors (cron-job.org, UptimeRobot, etc.)
// Prevents "Output too large" errors by returning a tiny 2-byte response "OK"
router.get(['/ping', '/health', '/api/ping'], (req, res) => {
  res.status(200).send('OK');
});

// /api/send-rent-reminders (supports both POST and GET)
router.route('/api/send-rent-reminders')
  .post(reminderController.sendRentReminders)
  .get(reminderController.sendRentReminders);

module.exports = router;
