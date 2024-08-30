const express = require("express"); // import express module
const { getRecipes, getRecipe, addRecipe, editRecipe, deleteRecipe, upload } = require("../controller/recipe");
const verifyToken = require("../middleware/auth");
const router = express.Router();    // create express router

// create route for home page
// It is used to get all the recipes
router.get("/", getRecipes);

// Route for getting recipes by id
router.get("/:id", getRecipe); // get is a method used to get

// Route for adding recipes
router.post("/", upload.single("file"), verifyToken, addRecipe); // post is a method used to add

// Route for updating recipes
router.put("/:id", upload.single("file"), editRecipe);  // put is a method used to update

// Route for deleting recipes
router.delete("/:id", deleteRecipe); // delete is a method used to delete


// export router so that it can be used in other parts of the application
module.exports = router;