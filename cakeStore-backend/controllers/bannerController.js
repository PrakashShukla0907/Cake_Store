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

    const imageUrl = req.file.path;
    const banner = await Banner.create({ image: imageUrl, active: true });

    res.status(200).json({ success: true, message: "Banner added", data: banner });
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

    const publicId = getCloudinaryPublicId(banner.image);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
    
    await banner.deleteOne();

    res.status(200).json({ success: true, message: "Banner removed" });
  } catch (error) {
    console.error("Error removing banner:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
