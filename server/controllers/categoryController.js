import Category from "../models/Category.js";

// Seed default categories helper
const seedDefaultCategories = async () => {
  const defaults = [
    "Electronics",
    "Vehicles",
    "Art & Antiques",
    "Real Estate",
    "Fashion",
    "Collectibles",
  ];
  for (const name of defaults) {
    await Category.findOneAndUpdate(
      { name },
      { name },
      { upsert: true, new: true }
    );
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    let categories = await Category.find().sort({ name: 1 });
    
    // Seed defaults if empty
    if (categories.length === 0) {
      await seedDefaultCategories();
      categories = await Category.find().sort({ name: 1 });
    }

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create new category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({ name: name.trim() });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
