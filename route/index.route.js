const express = require('express');
const multer = require('multer');
const {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
} = require('../controller/employee');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/employees', upload.single('profileImage'), createEmployee);
router.get('/employees', getEmployees);
router.put('/employees/:id', upload.single('profileImage'), updateEmployee);
router.delete('/employees/:id', deleteEmployee);

module.exports = router;
