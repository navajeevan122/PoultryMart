const express = require('express');
const router = express.Router();
const {
  getAdminDashboardStats,
  getAllSellers,
  getSellerById,
  updateSellerStatus,
  deleteSeller,
  getAllListingsForAdmin,
  getPendingListings,
  getAdminListingById,
  approveListing,
  rejectListing,
  editListingByAdmin,
  deleteListingByAdmin,
} = require('../controllers/adminController');
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// Protect all admin routes
router.use(authenticateUser);
router.use(authorizeRole('admin'));

// Admin Dashboard
router.get('/dashboard', getAdminDashboardStats);

// Admin Sellers Management
router.get('/sellers', getAllSellers);
router.get('/sellers/:id', getSellerById);
router.put('/sellers/:id/status', updateSellerStatus);
router.delete('/sellers/:id', deleteSeller);

// Admin Listings Management
router.get('/listings', getAllListingsForAdmin);
router.get('/listings/pending', getPendingListings);
router.get('/listings/:id', getAdminListingById);
router.put('/listings/:id/approve', approveListing);
router.put('/listings/:id/reject', rejectListing);
router.put('/listings/:id', editListingByAdmin);
router.delete('/listings/:id', deleteListingByAdmin);

module.exports = router;
