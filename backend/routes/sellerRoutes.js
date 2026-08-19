const express = require('express');
const router = express.Router();
const {
  createPoultryListing,
  getSellerPoultryListings,
  getSellerPoultryById,
  updatePoultryListing,
  deletePoultryListing,
  getSellerProfile,
  updateSellerProfile,
} = require('../controllers/sellerController');
const { authenticateUser, authorizeRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Protect all seller routes
router.use(authenticateUser);
router.use(authorizeRole('seller'));

// Seller Poultry CRUD
router.get('/poultry', getSellerPoultryListings);
router.post(
  '/poultry',
  upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 3 },
  ]),
  createPoultryListing
);
router.get('/poultry/:id', getSellerPoultryById);
router.put(
  '/poultry/:id',
  upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 3 },
  ]),
  updatePoultryListing
);
router.delete('/poultry/:id', deletePoultryListing);

// Seller Profile
router.get('/profile', getSellerProfile);
router.put(
  '/profile',
  upload.fields([{ name: 'profileImage', maxCount: 1 }]),
  updateSellerProfile
);

module.exports = router;
