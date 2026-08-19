const express = require('express');
const router = express.Router();
const {
  registerSeller,
  loginSeller,
  loginAdmin,
  getMe,
} = require('../controllers/authController');
const { authenticateUser } = require('../middleware/auth');

router.post('/seller/register', registerSeller);
router.post('/seller/login', loginSeller);
router.post('/admin/login', loginAdmin);
router.get('/me', authenticateUser, getMe);

module.exports = router;
