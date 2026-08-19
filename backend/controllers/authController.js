const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'poultrymart_jwt_super_secret_key_2026_dev', {
    expiresIn: '30d',
  });
};

// @desc    Register a new seller
// @route   POST /api/auth/seller/register
// @access  Public
const registerSeller = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      farmName,
      farmDescription,
      village,
      mandal,
      district,
      state,
      pincode,
    } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Please provide all required fields (Name, Email, Phone, Password)' });
    }

    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: 'seller',
      farmName: farmName || '',
      farmDescription: farmDescription || '',
      village: village || '',
      mandal: mandal || '',
      district: district || '',
      state: state || '',
      pincode: pincode || '',
      whatsappEnabled: true,
      isActive: true,
    });

    if (user) {
      const token = generateToken(user._id);
      return res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          farmName: user.farmName,
        },
      });
    } else {
      return res.status(400).json({ message: 'Invalid seller registration data' });
    }
  } catch (error) {
    console.error('[Register Seller Error]', error);
    return res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// @desc    Seller Login
// @route   POST /api/auth/seller/login
// @access  Public
const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.role !== 'seller') {
      return res.status(403).json({ message: 'Access denied. Account is not a seller.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Your account has been deactivated by admin' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        farmName: user.farmName,
      },
    });
  } catch (error) {
    console.error('[Seller Login Error]', error);
    return res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

// @desc    Admin Login
// @route   POST /api/auth/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || user.role !== 'admin') {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const token = generateToken(user._id);

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('[Admin Login Error]', error);
    return res.status(500).json({ message: error.message || 'Server error during admin login' });
  }
};

// @desc    Get Current Logged in User Profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = {
  registerSeller,
  loginSeller,
  loginAdmin,
  getMe,
};
