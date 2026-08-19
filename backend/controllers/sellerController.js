const Poultry = require('../models/Poultry');
const User = require('../models/User');
const { uploadToCloudinary } = require('../config/cloudinary');

// @desc    Create new poultry listing
// @route   POST /api/seller/poultry
// @access  Private (Seller)
const createPoultryListing = async (req, res) => {
  try {
    const {
      name,
      gender,
      breed,
      age,
      ageUnit,
      weight,
      weightUnit,
      price,
      quantity,
      village,
      mandal,
      district,
      state,
      pincode,
      healthStatus,
      vaccinationStatus,
      vaccinationDetails,
      description,
    } = req.body;

    if (!name || !gender || !breed || !age || !weight || !price) {
      return res.status(400).json({ message: 'Please provide all mandatory fields (Name, Gender, Breed, Age, Weight, Price)' });
    }

    // Process uploaded files
    const images = [];
    const videos = [];

    if (req.files) {
      // Check images field
      if (req.files.images && Array.isArray(req.files.images)) {
        for (const file of req.files.images) {
          const url = await uploadToCloudinary(file.path, 'poultrymart/images');
          images.push(url);
        }
      }

      // Check videos field
      if (req.files.videos && Array.isArray(req.files.videos)) {
        for (const file of req.files.videos) {
          const url = await uploadToCloudinary(file.path, 'poultrymart/videos');
          videos.push(url);
        }
      }
    }

    // Build composite location string
    const locParts = [
      village || req.user.village,
      mandal || req.user.mandal,
      district || req.user.district,
      state || req.user.state,
    ].filter(Boolean);
    const fullLocation = locParts.join(', ');

    const poultry = await Poultry.create({
      sellerId: req.user._id,
      name,
      gender,
      breed,
      age: Number(age),
      ageUnit: ageUnit || 'Months',
      weight: Number(weight),
      weightUnit: weightUnit || 'KG',
      price: Number(price),
      quantity: Number(quantity) || 1,
      village: village || req.user.village || '',
      mandal: mandal || req.user.mandal || '',
      district: district || req.user.district || '',
      state: state || req.user.state || '',
      pincode: pincode || req.user.pincode || '',
      location: fullLocation,
      healthStatus: healthStatus || 'Healthy',
      vaccinationStatus: vaccinationStatus || 'Vaccinated',
      vaccinationDetails: vaccinationDetails || '',
      description: description || '',
      media: {
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800'],
        videos,
      },
      approvalStatus: 'pending', // Starts as pending for admin review
      isAvailable: true,
      views: 0,
    });

    return res.status(201).json({
      message: 'Poultry listing submitted successfully and is waiting for admin approval.',
      poultry,
    });
  } catch (error) {
    console.error('[Create Poultry Error]', error);
    return res.status(500).json({ message: error.message || 'Error creating poultry listing' });
  }
};

// @desc    Get all poultry listings for logged-in seller
// @route   GET /api/seller/poultry
// @access  Private (Seller)
const getSellerPoultryListings = async (req, res) => {
  try {
    const listings = await Poultry.find({ sellerId: req.user._id }).sort({ createdAt: -1 });

    const totalListings = listings.length;
    const approvedCount = listings.filter((l) => l.approvalStatus === 'approved').length;
    const pendingCount = listings.filter((l) => l.approvalStatus === 'pending').length;
    const rejectedCount = listings.filter((l) => l.approvalStatus === 'rejected').length;
    const availableCount = listings.filter((l) => l.isAvailable && l.approvalStatus === 'approved').length;
    const totalViews = listings.reduce((sum, l) => sum + (l.views || 0), 0);

    return res.json({
      listings,
      stats: {
        totalListings,
        approvedCount,
        pendingCount,
        rejectedCount,
        availableCount,
        totalViews,
      },
    });
  } catch (error) {
    console.error('[Get Seller Poultry Error]', error);
    return res.status(500).json({ message: error.message || 'Error fetching seller listings' });
  }
};

// @desc    Get single poultry by ID for logged-in seller
// @route   GET /api/seller/poultry/:id
// @access  Private (Seller)
const getSellerPoultryById = async (req, res) => {
  try {
    const poultry = await Poultry.findById(req.params.id);

    if (!poultry) {
      return res.status(404).json({ message: 'Poultry listing not found' });
    }

    // Strict ownership verification
    if (poultry.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized. You can only view your own listings.' });
    }

    return res.json(poultry);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error fetching listing' });
  }
};

// @desc    Update poultry listing
// @route   PUT /api/seller/poultry/:id
// @access  Private (Seller)
const updatePoultryListing = async (req, res) => {
  try {
    const poultry = await Poultry.findById(req.params.id);

    if (!poultry) {
      return res.status(404).json({ message: 'Poultry listing not found' });
    }

    // Strict ownership verification
    if (poultry.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized. You can only edit your own listings.' });
    }

    const {
      name,
      gender,
      breed,
      age,
      ageUnit,
      weight,
      weightUnit,
      price,
      quantity,
      village,
      mandal,
      district,
      state,
      pincode,
      healthStatus,
      vaccinationStatus,
      vaccinationDetails,
      description,
      isAvailable,
      existingImages,
      existingVideos,
    } = req.body;

    // Handle new uploaded files
    let updatedImages = existingImages ? (Array.isArray(existingImages) ? existingImages : [existingImages]) : poultry.media.images;
    let updatedVideos = existingVideos ? (Array.isArray(existingVideos) ? existingVideos : [existingVideos]) : poultry.media.videos;

    if (req.files) {
      if (req.files.images && Array.isArray(req.files.images)) {
        for (const file of req.files.images) {
          const url = await uploadToCloudinary(file.path, 'poultrymart/images');
          updatedImages.push(url);
        }
      }
      if (req.files.videos && Array.isArray(req.files.videos)) {
        for (const file of req.files.videos) {
          const url = await uploadToCloudinary(file.path, 'poultrymart/videos');
          updatedVideos.push(url);
        }
      }
    }

    const locParts = [
      village || poultry.village,
      mandal || poultry.mandal,
      district || poultry.district,
      state || poultry.state,
    ].filter(Boolean);
    const fullLocation = locParts.join(', ');

    poultry.name = name || poultry.name;
    poultry.gender = gender || poultry.gender;
    poultry.breed = breed || poultry.breed;
    if (age) poultry.age = Number(age);
    if (ageUnit) poultry.ageUnit = ageUnit;
    if (weight) poultry.weight = Number(weight);
    if (weightUnit) poultry.weightUnit = weightUnit;
    if (price) poultry.price = Number(price);
    if (quantity) poultry.quantity = Number(quantity);
    if (village !== undefined) poultry.village = village;
    if (mandal !== undefined) poultry.mandal = mandal;
    if (district !== undefined) poultry.district = district;
    if (state !== undefined) poultry.state = state;
    if (pincode !== undefined) poultry.pincode = pincode;
    poultry.location = fullLocation;
    if (healthStatus) poultry.healthStatus = healthStatus;
    if (vaccinationStatus) poultry.vaccinationStatus = vaccinationStatus;
    if (vaccinationDetails !== undefined) poultry.vaccinationDetails = vaccinationDetails;
    if (description !== undefined) poultry.description = description;
    if (isAvailable !== undefined) poultry.isAvailable = isAvailable === 'true' || isAvailable === true;

    poultry.media = {
      images: updatedImages,
      videos: updatedVideos,
    };

    // Reset status to pending if seller modified key details
    poultry.approvalStatus = 'pending';

    await poultry.save();

    return res.json({
      message: 'Poultry listing updated and resubmitted for admin approval.',
      poultry,
    });
  } catch (error) {
    console.error('[Update Poultry Error]', error);
    return res.status(500).json({ message: error.message || 'Error updating poultry listing' });
  }
};

// @desc    Delete poultry listing
// @route   DELETE /api/seller/poultry/:id
// @access  Private (Seller)
const deletePoultryListing = async (req, res) => {
  try {
    const poultry = await Poultry.findById(req.params.id);

    if (!poultry) {
      return res.status(404).json({ message: 'Poultry listing not found' });
    }

    // Strict ownership verification
    if (poultry.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized. You can only delete your own listings.' });
    }

    await poultry.deleteOne();

    return res.json({ message: 'Poultry listing deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error deleting poultry listing' });
  }
};

// @desc    Get Seller Profile
// @route   GET /api/seller/profile
// @access  Private (Seller)
const getSellerProfile = async (req, res) => {
  try {
    const seller = await User.findById(req.user._id);
    return res.json(seller);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error fetching profile' });
  }
};

// @desc    Update Seller Profile
// @route   PUT /api/seller/profile
// @access  Private (Seller)
const updateSellerProfile = async (req, res) => {
  try {
    const seller = await User.findById(req.user._id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const {
      name,
      phone,
      farmName,
      farmDescription,
      farmAddress,
      village,
      mandal,
      district,
      state,
      pincode,
      whatsappEnabled,
    } = req.body;

    if (name) seller.name = name;
    if (phone) seller.phone = phone;
    if (farmName !== undefined) seller.farmName = farmName;
    if (farmDescription !== undefined) seller.farmDescription = farmDescription;
    if (farmAddress !== undefined) seller.farmAddress = farmAddress;
    if (village !== undefined) seller.village = village;
    if (mandal !== undefined) seller.mandal = mandal;
    if (district !== undefined) seller.district = district;
    if (state !== undefined) seller.state = state;
    if (pincode !== undefined) seller.pincode = pincode;
    if (whatsappEnabled !== undefined) {
      seller.whatsappEnabled = whatsappEnabled === 'true' || whatsappEnabled === true;
    }

    // Handle profile image upload if provided
    if (req.files && req.files.profileImage && req.files.profileImage[0]) {
      const url = await uploadToCloudinary(req.files.profileImage[0].path, 'poultrymart/profiles');
      seller.profileImage = url;
    }

    await seller.save();

    return res.json({
      message: 'Profile updated successfully',
      user: seller,
    });
  } catch (error) {
    console.error('[Update Profile Error]', error);
    return res.status(500).json({ message: error.message || 'Error updating profile' });
  }
};

module.exports = {
  createPoultryListing,
  getSellerPoultryListings,
  getSellerPoultryById,
  updatePoultryListing,
  deletePoultryListing,
  getSellerProfile,
  updateSellerProfile,
};
