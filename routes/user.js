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


module.exports = router;
