var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("I'm here"));

/**
 * This path is for searching a recipe
 */
router.get("/search", async (req, res, next) => {
  try {
    const recipeName = req.body.recipeName;
    const cuisine = req.body.cuisine;
    const diet = req.body.diet;
    const intolerance = req.body.intolerance;
    const number = req.body.number;    
    const results = await recipes_utils.searchRecipe(recipeName, cuisine, diet, intolerance, number);
    res.send(results);
  } catch (error) {
    next(error);
  }
}); // <-- Missing closing bracket added here

/**
 * This path returns 3 random recipes to use when the site is opens
 */
router.get("/random", async (req, res, next) => {
  try {
    const number = req.body.number;
    console.log(`Received number from query params: ${req.body.number}`);
    console.log(`Using number for fetching recipes: ${number}`);

    const results = await recipes_utils.getRandomRecipes(number);
    res.send(results);
  } catch (error) {
    console.error("Failed to get random recipes:", error);
    next(error);
  }
});



/**
 * This path returns full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});





module.exports = router;