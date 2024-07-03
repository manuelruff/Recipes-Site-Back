const DButils = require("./DButils");
const recipes_utils = require("./recipes_utils");


async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);
    return recipes_id;
}

async function removeFavorite(user_id, recipe_id) {
    await DButils.execQuery(`DELETE FROM FavoriteRecipes WHERE user_id='${user_id}' AND recipe_id=${recipe_id}`);
  }

async function getMeals(user_id) {
  const mealIds = await DButils.execQuery(`SELECT recipe_id FROM usermeals WHERE user_id='${user_id}'`);
  const mealDetailsPromises = mealIds.map(meal => recipes_utils.getRecipeDetails(meal.recipe_id));
  try {
      const mealDetails = await Promise.all(mealDetailsPromises);
      return mealDetails;
  } catch (error) {
      console.error("Failed to fetch meals:", error);
      throw error;
  }
}

async function markAsMeal(user_id, recipe_id){
  await DButils.execQuery(`insert into usermeals values ('${user_id}',${recipe_id})`);
}

async function removeFromMeal(user_id, recipe_id) {
  await DButils.execQuery(`DELETE FROM usermeals WHERE user_id='${user_id}' AND recipe_id=${recipe_id}`);
}



module.exports = {
    markAsFavorite,
    removeFavorite,
    getFavoriteRecipes,
    getMeals,
    markAsMeal,
    removeFromMeal
  };