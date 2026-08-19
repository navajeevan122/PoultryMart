const Poultry = require('../models/Poultry');

// @desc    Get all public poultry listings (Approved & Available) with search, filter & sort
// @route   GET /api/poultry
// @access  Public
const getPublicPoultryListings = async (req, res) => {
  try {
    const {
      search,
      gender,
      breed,
      minPrice,
      maxPrice,
      minAge,
      maxAge,
      minWeight,
      maxWeight,
      location,
      healthStatus,
      sortBy,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {
      approvalStatus: 'approved',
      isAvailable: true,
    };

    // Filter by Gender (Hen / Cock)
    if (gender && gender !== 'All') {
      query.gender = gender;
    }

    // Filter by Breed
    if (breed && breed !== 'All') {
      query.breed = { $regex: new RegExp(breed, 'i') };
    }

    // Filter by Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by Age range
    if (minAge || maxAge) {
      query.age = {};
      if (minAge) query.age.$gte = Number(minAge);
      if (maxAge) query.age.$lte = Number(maxAge);
    }

    // Filter by Weight range
    if (minWeight || maxWeight) {
      query.weight = {};
      if (minWeight) query.weight.$gte = Number(minWeight);
      if (maxWeight) query.weight.$lte = Number(maxWeight);
    }

    // Filter by Health Status
    if (healthStatus && healthStatus !== 'All') {
      query.healthStatus = healthStatus;
    }

    // Filter by Location
    if (location) {
      const locRegex = new RegExp(location, 'i');
      query.$or = [
        { village: locRegex },
        { mandal: locRegex },
        { district: locRegex },
        { state: locRegex },
        { location: locRegex },
      ];
    }

    // Keyword Search across name, breed, location, description
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      const searchCondition = {
        $or: [
          { name: searchRegex },
          { breed: searchRegex },
          { location: searchRegex },
          { village: searchRegex },
          { district: searchRegex },
          { description: searchRegex },
        ],
      };

      if (query.$or) {
        query.$and = [{ $or: query.$or }, searchCondition];
        delete query.$or;
      } else {
        query.$or = searchCondition.$or;
      }
    }

    // Sorting logic
    let sortOptions = { createdAt: -1 }; // Default: Newest first
    if (sortBy === 'price_asc') sortOptions = { price: 1 };
    else if (sortBy === 'price_desc') sortOptions = { price: -1 };
    else if (sortBy === 'age_asc') sortOptions = { age: 1 };
    else if (sortBy === 'age_desc') sortOptions = { age: -1 };
    else if (sortBy === 'views') sortOptions = { views: -1 };
    else if (sortBy === 'newest') sortOptions = { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const poultryListings = await Poultry.find(query)
      .populate('sellerId', 'name phone farmName village district state profileImage whatsappEnabled')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const total = await Poultry.countDocuments(query);

    return res.json({
      poultry: poultryListings,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (error) {
    console.error('[Get Public Poultry Error]', error);
    return res.status(500).json({ message: error.message || 'Error fetching public poultry listings' });
  }
};

// @desc    Get single poultry details by ID & Increment view count
// @route   GET /api/poultry/:id
// @access  Public
const getPoultryById = async (req, res) => {
  try {
    const poultry = await Poultry.findById(req.params.id).populate(
      'sellerId',
      'name phone email farmName farmDescription village mandal district state pincode profileImage whatsappEnabled createdAt'
    );

    if (!poultry) {
      return res.status(404).json({ message: 'Poultry listing not found' });
    }

    // Increment views count atomically
    poultry.views = (poultry.views || 0) + 1;
    await poultry.save({ validateBeforeSave: false });

    return res.json(poultry);
  } catch (error) {
    console.error('[Get Poultry By ID Error]', error);
    return res.status(500).json({ message: error.message || 'Error fetching poultry details' });
  }
};

// @desc    Get list of unique poultry breeds
// @route   GET /api/breeds
// @access  Public
const getUniqueBreeds = async (req, res) => {
  try {
    const breeds = await Poultry.distinct('breed', { approvalStatus: 'approved' });
    return res.json(breeds.filter(Boolean));
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching breeds' });
  }
};

// @desc    Get list of unique locations
// @route   GET /api/locations
// @access  Public
const getUniqueLocations = async (req, res) => {
  try {
    const districts = await Poultry.distinct('district', { approvalStatus: 'approved' });
    const states = await Poultry.distinct('state', { approvalStatus: 'approved' });
    return res.json({
      districts: districts.filter(Boolean),
      states: states.filter(Boolean),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching locations' });
  }
};

module.exports = {
  getPublicPoultryListings,
  getPoultryById,
  getUniqueBreeds,
  getUniqueLocations,
};
