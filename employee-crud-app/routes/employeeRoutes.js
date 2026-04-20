const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getStats,
} = require('../controllers/employeeController');
const { protect, admin } = require('../middleware/auth');

// Static route must come before /:id to avoid matching "stats" as an id
router.get('/stats/summary', protect, admin, getStats);

router.get('/', protect, getEmployees);
router.get('/:id', protect, getEmployee);
router.post('/', protect, admin, createEmployee);
router.put('/:id', protect, admin, updateEmployee);
router.delete('/:id', protect, admin, deleteEmployee);

module.exports = router;
