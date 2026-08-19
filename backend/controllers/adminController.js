const User = require('../models/User');
const Poultry = require('../models/Poultry');

// @desc    Get Admin Dashboard Statistics from MongoDB Atlas
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getAdminDashboardStats = async (req, res) => {
  try {
    const totalSellers = await User.countDocuments({ role: 'seller' });
    const totalListings = await Poultry.countDocuments();
    const approvedListings = await Poultry.countDocuments({ approvalStatus: 'approved' });
    const pendingListings = await Poultry.countDocuments({ approvalStatus: 'pending' });
    const rejectedListings = await Poultry.countDocuments({ approvalStatus: 'rejected' });
    const availablePoultry = await Poultry.countDocuments({ approvalStatus: 'approved', isAvailable: true });

    const viewsAgg = await Poultry.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } },
    ]);
    const totalViews = viewsAgg.length > 0 ? viewsAgg[0].totalViews : 0;

    return res.json({
      totalSellers,
      totalListings,
      approvedListings,
      pendingListings,
      rejectedListings,
      availablePoultry,
      totalViews,
    });
  } catch (error) {
    console.error('[Admin Dashboard Stats Error]', error);
    return res.status(500).json({ message: error.message || 'Error fetching dashboard stats' });
  }
};

// @desc    Get all sellers with filtering & search
// @route   GET /api/admin/sellers
// @access  Private (Admin)
const getAllSellers = async (req, res) => {
  try {
    const { search } = req.query;
    const query = { role: 'seller' };

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { farmName: searchRegex },
        { district: searchRegex },
      ];
    }

    const sellers = await User.find(query).sort({ createdAt: -1 });

    // Attach listing count for each seller
    const sellersWithCounts = await Promise.all(
      sellers.map(async (seller) => {
        const count = await Poultry.countDocuments({ sellerId: seller._id });
        return {
          ...seller.toObject(),
          listingsCount: count,
        };
      })
    );

    return res.json(sellersWithCounts);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error fetching sellers' });
  }
};

// @desc    Get seller by ID with their listings
// @route   GET /api/admin/sellers/:id
// @access  Private (Admin)
const getSellerById = async (req, res) => {
  try {
    const seller = await User.findById(req.params.id);
    if (!seller || seller.role !== 'seller') {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const listings = await Poultry.find({ sellerId: seller._id }).sort({ createdAt: -1 });

    return res.json({
      seller,
      listings,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error fetching seller details' });
  }
};

// @desc    Activate/Deactivate seller account
// @route   PUT /api/admin/sellers/:id/status
// @access  Private (Admin)
const updateSellerStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const seller = await User.findById(req.params.id);

    if (!seller || seller.role !== 'seller') {
      return res.status(404).json({ message: 'Seller not found' });
    }

    seller.isActive = isActive;
    await seller.save();

    return res.json({
      message: `Seller account ${isActive ? 'activated' : 'deactivated'} successfully`,
      seller,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error updating seller status' });
  }
};

// @desc    Delete seller and all associated listings
// @route   DELETE /api/admin/sellers/:id
// @access  Private (Admin)
const deleteSeller = async (req, res) => {
  try {
    const seller = await User.findById(req.params.id);

    if (!seller || seller.role !== 'seller') {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Cascade delete seller's poultry listings
    await Poultry.deleteMany({ sellerId: seller._id });
    await seller.deleteOne();

    return res.json({ message: 'Seller and all associated poultry listings deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error deleting seller' });
  }
};

// @desc    Get all listings for admin (with optional approvalStatus filter)
// @route   GET /api/admin/listings
// @access  Private (Admin)
const getAllListingsForAdmin = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.approvalStatus = status;
    }

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { breed: searchRegex },
        { location: searchRegex },
        { district: searchRegex },
      ];
    }

    const listings = await Poultry.find(query)
      .populate('sellerId', 'name phone farmName email village district state')
      .sort({ createdAt: -1 });

    return res.json(listings);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error fetching listings' });
  }
};

// @desc    Get pending listings queue
// @route   GET /api/admin/listings/pending
// @access  Private (Admin)
const getPendingListings = async (req, res) => {
  try {
    const pendingListings = await Poultry.find({ approvalStatus: 'pending' })
      .populate('sellerId', 'name phone farmName email village district state profileImage')
      .sort({ createdAt: -1 });

    return res.json(pendingListings);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error fetching pending listings' });
  }
};

// @desc    Get single listing details for admin review
// @route   GET /api/admin/listings/:id
// @access  Private (Admin)
const getAdminListingById = async (req, res) => {
  try {
    const poultry = await Poultry.findById(req.params.id).populate('sellerId');

    if (!poultry) {
      return res.status(404).json({ message: 'Poultry listing not found' });
    }

    return res.json(poultry);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error fetching listing' });
  }
};

// @desc    Approve listing
// @route   PUT /api/admin/listings/:id/approve
// @access  Private (Admin)
const approveListing = async (req, res) => {
  try {
    const poultry = await Poultry.findById(req.params.id);

    if (!poultry) {
      return res.status(404).json({ message: 'Poultry listing not found' });
    }

    poultry.approvalStatus = 'approved';
    poultry.rejectionReason = '';
    await poultry.save();

    return res.json({
      message: 'Poultry listing approved successfully',
      poultry,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error approving listing' });
  }
};

// @desc    Reject listing with reason
// @route   PUT /api/admin/listings/:id/reject
// @access  Private (Admin)
const rejectListing = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const poultry = await Poultry.findById(req.params.id);

    if (!poultry) {
      return res.status(404).json({ message: 'Poultry listing not found' });
    }

    if (!rejectionReason || rejectionReason.trim() === '') {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    poultry.approvalStatus = 'rejected';
    poultry.rejectionReason = rejectionReason;
    await poultry.save();

    return res.json({
      message: 'Poultry listing rejected',
      poultry,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error rejecting listing' });
  }
};

// @desc    Edit listing by admin
// @route   PUT /api/admin/listings/:id
// @access  Private (Admin)
const editListingByAdmin = async (req, res) => {
  try {
    const poultry = await Poultry.findById(req.params.id);

    if (!poultry) {
      return res.status(404).json({ message: 'Poultry listing not found' });
    }

    const {
      name,
      gender,
      breed,
      age,
      price,
      quantity,
      approvalStatus,
      isAvailable,
    } = req.body;

    if (name) poultry.name = name;
    if (gender) poultry.gender = gender;
    if (breed) poultry.breed = breed;
    if (age) poultry.age = Number(age);
    if (price) poultry.price = Number(price);
    if (quantity) poultry.quantity = Number(quantity);
    if (approvalStatus) poultry.approvalStatus = approvalStatus;
    if (isAvailable !== undefined) poultry.isAvailable = isAvailable;

    await poultry.save();

    return res.json({
      message: 'Listing updated by admin',
      poultry,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error editing listing' });
  }
};

// @desc    Delete listing by admin
// @route   DELETE /api/admin/listings/:id
// @access  Private (Admin)
const deleteListingByAdmin = async (req, res) => {
  try {
    const poultry = await Poultry.findById(req.params.id);

    if (!poultry) {
      return res.status(404).json({ message: 'Poultry listing not found' });
    }

    await poultry.deleteOne();

    return res.json({ message: 'Poultry listing deleted successfully by admin' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error deleting listing' });
  }
};

module.exports = {
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
};
