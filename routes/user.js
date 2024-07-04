var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils"); // Ensure the path is correct

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users").then((users) => {
      if (users.find((x) => x.user_id === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});

/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(user_id, recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the favorite recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    const recipes_id_array = recipes_id.map(element => element.recipe_id); // Extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});
/**
 * This path deletes the favorite recipe from the logged-in user
 */
router.delete('/favorites', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.removeFavorite(user_id, recipe_id);
    res.status(200).send("The Recipe successfully removed from favorites");
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the meals plan for the logged-in user
 */
router.get('/meals', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const meals = await user_utils.getMeals(user_id);
    res.status(200).send(meals);
  } catch (error) {
    next(error);
  }
});
/**
 * This path adds the revipe to meal plan for the logged-in user
 */
router.post('/meals', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsMeal(user_id, recipe_id);
    res.status(200).send("The Recipe successfully saved to meals");
  } catch (error) {
    next(error);
  }
});
/**
 * This path deletes the revipe from meal plan for the logged-in user
 */
router.delete('/meals', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.removeFromMeal(user_id, recipe_id);
    res.status(200).send("The Recipe successfully removed from meals");
  } catch (error) {
    next(error);
  }
});

/**
 * This path adds the recipe to laseViewed for the logged-in user
 */
router.post('/lastview', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsLastView(user_id, recipe_id);
    res.status(200).send("The Recipe successfully added to last View");
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the meals plan for the logged-in user
 */
router.get('/lastview', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const lastview = await user_utils.getLastViews(user_id);
    res.status(200).send(lastview);
  } catch (error) {
    next(error);
  }
});

/**
 * This path adds a new recipe for the logged-in user
 */
router.post('/myrecipes', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    console.log("Request body:", req.body); // Log the entire request body

    const { title, image, instructions, readyInMinutes, servings, glutenFree, vegan, vegetarian, ingredients } = req.body;
    
    console.log("Title:", title);
    console.log("Image:", image);
    console.log("Ready In Minutes:", readyInMinutes);
    console.log("Servings:", servings);
    console.log("Gluten Free:", glutenFree);
    console.log("Vegan:", vegan);
    console.log("Vegetarian:", vegetarian);
    console.log("Instructions:", instructions);
    console.log("Ingredients:", ingredients);

    // Ensure instructions and ingredients are arrays
    if (!Array.isArray(instructions)) {
      throw new TypeError("Instructions should be an array");
    }
    if (!Array.isArray(ingredients)) {
      throw new TypeError("Ingredients should be an array");
    }

    // Insert the new recipe into the Recipes table and get the new recipe_id
    const recipe_id = await user_utils.addRecipe({
      title,
      image,
      readyInMinutes,
      servings,
      glutenFree,
      vegan,
      vegetarian
    });

    // Insert instructions
    await Promise.all(instructions.map((instruction, index) => 
      user_utils.addInstruction(recipe_id, instruction.text, index + 1)
    ));
    
    // Insert ingredients
    await Promise.all(ingredients.map(({ name, amount }) => 
      user_utils.addIngredient(recipe_id, name, amount)
    ));
    
    res.status(200).send("Recipe successfully added");
  } catch (error) {
    console.error("Error in /myrecipes:", error);
    next(error);
  }
});
/**
 * This path returns the recipes for the logged-in user
 */
router.get('/myrecipes', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipes = await user_utils.getUserRecipes(user_id);
    res.status(200).send(recipes);
  } catch (error) {
    next(error);
  }
});


/**
 * This path returns the family recipes for the logged-in user
 */
router.get('/lastview', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const lastview = await user_utils.getLastViews(user_id);
    res.status(200).send(lastview);
  } catch (error) {
    next(error);
  }
});





module.exports = router;
