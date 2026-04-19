import Product from "../models/product.js";
import { v2 as cloudinary } from "cloudinary";

// Helper function to extract Cloudinary public ID from URL
const getCloudinaryPublicId = (imageUrl) => {
  if (!imageUrl) return null;
  // Example URL: https://res.cloudinary.com/dngrk2bwl/image/upload/v1234567/cakeStore/filename.jpg
  // We need "cakeStore/filename"
  try {
    const parts = imageUrl.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null;
    
    // Get everything after the version folder (e.g., v1234567)
    const relativePath = parts.slice(uploadIndex + 2).join('/');
    // Remove the file extension
    const publicId = relativePath.split('.')[0];
    return publicId;
  } catch (err) {
    console.error("Error extracting public ID:", err);
    return null;
  }
};

/**
 * CREATE PRODUCT
 */
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, available } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Instantly save product with temporary image placeholder
    const product = await Product.create({
      name,
      description,
      price,
      category,
      available,
      image: "", // Background task will update this
    });

    res.status(201).json({
      success: true,
      product,
    });

    // Background Cloudinary Upload
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "cakeStore",
        transformation: [{ width: 800, height: 800, crop: "limit", quality: "auto", fetch_format: "auto" }]
      },
      async (err, result) => {
        if (result) {
          product.image = result.secure_url;
          await product.save();
        } else {
          console.error("Cloudinary async upload error in createProduct:", err);
        }
      }
    );
    stream.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL PRODUCTS
 */
export const getAllProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const keyword = req.query.search
      ? {
          name: { $regex: req.query.search, $options: "i" },
        }
      : {};

    const [products, total] = await Promise.all([
      Product.find({ ...keyword })
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 }),
      Product.countDocuments(keyword)
    ]);

    res.status(200).json({
      success: true,
      page,
      pages: Math.ceil(total / limit),
      total,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET SINGLE PRODUCT
 */
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE PRODUCT
 */
export const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    if (req.file) {
      // Delete old image from Cloudinary if it exists in background
      const publicId = getCloudinaryPublicId(product.image);
      if (publicId) {
        cloudinary.uploader.destroy(publicId).catch(err => console.error("Cloudinary async delete error:", err));
      }
      
      // Upload new image in background
      const stream = cloudinary.uploader.upload_stream(
        { folder: "cakeStore", transformation: [{ width: 800, height: 800, crop: "limit", quality: "auto", fetch_format: "auto" }] },
        async (err, result) => {
          if (result) {
            await Product.updateOne({ _id: product._id }, { $set: { image: result.secure_url } });
          } else {
            console.error("Cloudinary async upload error in updateProduct:", err);
          }
        }
      );
      stream.end(req.file.buffer);

      // Prevent overwriting it synchronously if body mistakenly had it
      delete req.body.image;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE PRODUCT
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete image from Cloudinary asynchronously
    const publicId = getCloudinaryPublicId(product.image);
    if (publicId) {
      cloudinary.uploader.destroy(publicId).catch(err => console.error("Cloudinary async delete error:", err));
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product and image deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * TOGGLE AVAILABILITY
 */
export const toggleAvailability = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    product.available = !product.available;
    await product.save();

    res.status(200).json({
      success: true,
      available: product.available,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
