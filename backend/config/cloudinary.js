const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

const isCloudinaryConfigured = () => {
  return (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('[Cloudinary] Configured successfully.');
} else {
  console.log('[Cloudinary] Credentials not set in .env. Falling back to local uploads storage.');
}

/**
 * Upload local file to Cloudinary or serve from local server static folder
 */
const uploadToCloudinary = async (filePath, folder = 'poultrymart') => {
  if (isCloudinaryConfigured()) {
    try {
      const isVideo = filePath.match(/\.(mp4|mov|webm)$/i);
      const result = await cloudinary.uploader.upload(filePath, {
        folder: folder,
        resource_type: isVideo ? 'video' : 'image',
      });
      // Optionally remove temporary file after successful Cloudinary upload
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return result.secure_url;
    } catch (error) {
      console.error('[Cloudinary Upload Error]', error);
      throw error;
    }
  } else {
    // Return relative static file URL for local dev server
    const filename = path.basename(filePath);
    return `/uploads/${filename}`;
  }
};

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  uploadToCloudinary,
};
