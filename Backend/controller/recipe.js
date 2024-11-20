// Backend\controller\recipe.js
const Recipes = require("../models/recipe");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Ensure upload directory exists
const uploadDir = './public/images';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

// Configure multer upload
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Validate file types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and GIF allowed'));
    }
  }
});

// Get all recipes
const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipes.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching recipes'
    });
  }
};

// Get single recipe
const getRecipe = async (req, res) => {
  try {
    const recipe = await Recipes.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: recipe
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching recipe'
    });
  }
};

// Add new recipe
const addRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, time } = req.body;

    // Validate required fields
    if (!title?.trim() || !ingredients?.length || !instructions?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title, ingredients, and instructions are required'
      });
    }

    // Validate image
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Cover image is required'
      });
    }

    const newRecipe = await Recipes.create({
      title: title.trim(),
      ingredients: Array.isArray(ingredients) ? ingredients : [ingredients],
      instructions: instructions.trim(),
      time,
      coverImage: req.file.filename,
      createdBy: req.user.id
    });

    return res.status(201).json({
      success: true,
      data: newRecipe
    });
  } catch (error) {
    // Clean up uploaded file if recipe creation fails
    if (req.file) {
      fs.unlink(path.join(uploadDir, req.file.filename), (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error creating recipe'
    });
  }
};

// Edit recipe
const editRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, time } = req.body;
    const recipeId = req.params.id;

    // Check if recipe exists
    let recipe = await Recipes.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Check ownership
    if (recipe.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this recipe'
      });
    }

    // Handle image update
    let coverImage = recipe.coverImage;
    if (req.file) {
      // Delete old image
      fs.unlink(path.join(uploadDir, recipe.coverImage), (err) => {
        if (err) console.error('Error deleting old image:', err);
      });
      coverImage = req.file.filename;
    }

    // Update recipe
    const updatedRecipe = await Recipes.findByIdAndUpdate(
      recipeId,
      {
        title: title?.trim() || recipe.title,
        ingredients: ingredients || recipe.ingredients,
        instructions: instructions?.trim() || recipe.instructions,
        time: time || recipe.time,
        coverImage
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      data: updatedRecipe
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error updating recipe'
    });
  }
};

// Delete recipe
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipes.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Check ownership
    if (recipe.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this recipe'
      });
    }

    // Delete image file
    if (recipe.coverImage) {
      fs.unlink(path.join(uploadDir, recipe.coverImage), (err) => {
        if (err) console.error('Error deleting image:', err);
      });
    }

    await recipe.remove();

    return res.status(200).json({
      success: true,
      message: 'Recipe deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting recipe'
    });
  }
};

// export getRecipes function
module.exports = { getRecipes, getRecipe, addRecipe, editRecipe, deleteRecipe, upload };
