import Banner from "../models/banner.js";
import { v2 as cloudinary } from "cloudinary";

// Helper function to extract Cloudinary public ID from URL
const getCloudinaryPublicId = (imageUrl) => {
  if (!imageUrl) return null;
  try {
    const parts = imageUrl.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null;
    const relativePath = parts.slice(uploadIndex + 2).join('/');
    const publicId = relativePath.split('.')[0];
    return publicId;
  } catch (err) {
    console.error("Error extracting public ID:", err);
    return null;
  }
};

// @desc    Get all banner images
// @route   GET /api/v1/banners
// @access  Public
export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ active: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: banners });
  } catch (error) {
    console.error("Error fetching banners:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Add a banner image
// @route   POST /api/v1/banners
// @access  Private/Admin
export const addBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload an image" });
    }

    // Create banner instantly with placeholder (Mongoose string required: true fails on empty string)
    const banner = await Banner.create({ image: "uploading...", active: true });

    res.status(200).json({ success: true, message: "Banner added", data: banner });

    // Background Cloudinary Upload
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "cakeStore",
        transformation: [{ width: 800, height: 800, crop: "limit", quality: "auto", fetch_format: "auto" }]
      },
      async (err, result) => {
        if (result) {
          banner.image = result.secure_url;
          await banner.save();
        } else {
          console.error("Cloudinary async upload error in addBanner:", err);
        }
      }
    );
    stream.end(req.file.buffer);
  } catch (error) {
    console.error("Error adding banner:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Remove a banner image
// @route   DELETE /api/v1/banners/:id
// @access  Private/Admin
export const removeBanner = async (req, res) => {
  try {
    const bannerId = req.params.id;
    const banner = await Banner.findById(bannerId);
    
    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    // Delete synchronously from DB but asynchronously from Cloudinary
    const publicId = getCloudinaryPublicId(banner.image);
    if (publicId) {
      cloudinary.uploader.destroy(publicId).catch(err => console.error("Cloudinary async delete error:", err));
    }
    
    await banner.deleteOne();

    res.status(200).json({ success: true, message: "Banner removed" });
  } catch (error) {
    console.error("Error removing banner:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
