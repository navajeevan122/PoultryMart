const express = require('express');
const router = express.Router();
const {
  getPublicPoultryListings,
  getPoultryById,
  getUniqueBreeds,
  getUniqueLocations,
} = require('../controllers/poultryController');

// Public Endpoints
router.get('/poultry', getPublicPoultryListings);
router.get('/poultry/:id', getPoultryById);
router.get('/breeds', getUniqueBreeds);
router.get('/locations', getUniqueLocations);

module.exports = router;
