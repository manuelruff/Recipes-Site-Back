const { use } = require("../user");
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

// last view code
async function markAsLastView(user_id, recipe_id) {
  // Get the current last views for the user
  let result = await DButils.execQuery(`SELECT LastView1, LastView2, LastView3 FROM userlastview WHERE user_id = ${user_id}`);

  if (result.length === 0) {
      // User not found in UserLastView, insert new row
      await DButils.execQuery(`INSERT INTO userlastview (user_id, LastView1) VALUES (${user_id}, ${recipe_id})`);
  } else {
      // User found, update the views
      let { LastView1, LastView2 } = result[0];
      
      await DButils.execQuery(`
          UPDATE userlastview
          SET LastView1 = ${recipe_id},
              LastView2 = ${LastView1 !== null ? LastView1 : 'NULL'},
              LastView3 = ${LastView2 !== null ? LastView2 : 'NULL'}
          WHERE user_id = ${user_id}
      `);
  }
}



async function getLastViews(user_id) {
  // Fetch the last viewed recipe IDs
  const result = await DButils.execQuery(`SELECT LastView1, LastView2, LastView3 FROM UserLastView WHERE user_id='${user_id}'`);

  if (result.length === 0) {
      // If no records are found, return an empty array
      return [];
  }

  const { LastView1, LastView2, LastView3 } = result[0];
  const lastViewIds = [LastView1, LastView2, LastView3].filter(id => id !== null);

  // Fetch the details of each recipe
  const lastViewDetailsPromises = lastViewIds.map(recipe_id => recipes_utils.getRecipeDetails(recipe_id));

  try {
      const lastViewDetails = await Promise.all(lastViewDetailsPromises);
      return lastViewDetails;
  } catch (error) {
      console.error("Failed to fetch last viewed recipes:", error);
      throw error;
  }
}

async function addRecipe({ title, image, readyInMinutes, servings, glutenFree, vegan, vegetarian }) {
  try {
    console.log("Inserting recipe with values:", { title, image, readyInMinutes, servings, glutenFree, vegan, vegetarian });

    const query = `
      INSERT INTO Recipes (title, image_url, ready_in_minutes, servings, gluten_free, vegan, vegetarian)
      VALUES ('${title}', '${image}', ${readyInMinutes}, ${servings}, ${glutenFree}, ${vegan}, ${vegetarian})
    `;
    console.log("Executing query:", query);

    const result = await DButils.execQuery(query);
    const recipeId = result.insertId;
    console.log("Inserted recipe ID:", recipeId);

    return recipeId;
  } catch (error) {
    console.error("Error inserting recipe:", error);
    throw error;
  }
}

async function addInstruction(recipe_id, instruction, instruction_number) {
  try {
    console.log("Inserting instruction with values:", { recipe_id, instruction, instruction_number });
    const query = `
      INSERT INTO Instructions (recipe_id, instruction, instruction_number)
      VALUES (${recipe_id}, '${instruction}', ${instruction_number})
    `;
    console.log("Executing instruction query:", query);
    await DButils.execQuery(query);
  } catch (error) {
    console.error("Error inserting instruction:", error);
    throw error;
  }
}

async function addIngredient(recipe_id, ingredient_name, amount) {
  try {
    console.log("Inserting ingredient with values:", { recipe_id, ingredient_name, amount });
    const query = `
      INSERT INTO Ingredients (recipe_id, ingredient_name, amount)
      VALUES (${recipe_id}, '${ingredient_name}', '${amount}')
    `;
    console.log("Executing ingredient query:", query);
    await DButils.execQuery(query);
  } catch (error) {
    console.error("Error inserting ingredient:", error);
    throw error;
  }
}
async function getUserRecipes(user_id) {
  try {
    const recipes = await DButils.execQuery(
      `SELECT R.recipe_id, R.title, R.image_url, R.ready_in_minutes, R.servings, R.gluten_free, R.vegan, R.vegetarian
       FROM Recipes R
       JOIN UserMeals UM ON R.recipe_id = UM.recipe_id
       WHERE UM.user_id = ?`,
      [user_id]
    );

    for (const recipe of recipes) {
      const instructions = await DButils.execQuery(
        `SELECT instruction, instruction_number FROM Instructions WHERE recipe_id = ? ORDER BY instruction_number`,
        [recipe.recipe_id]
      );

      const ingredients = await DButils.execQuery(
        `SELECT ingredient_name, amount FROM Ingredients WHERE recipe_id = ?`,
        [recipe.recipe_id]
      );

      recipe.instructions = instructions.map(i => i.instruction);
      recipe.ingredients = ingredients;
    }

    return recipes;
  } catch (error) {
    console.error("Error fetching user recipes:", error);
    throw error;
  }
}





module.exports = {
    markAsFavorite,
    removeFavorite,
    getFavoriteRecipes,
    getMeals,
    markAsMeal,
    removeFromMeal,
    markAsLastView,
    getLastViews,
    addRecipe,
    addInstruction,
    addIngredient,
    getUserRecipes
  };