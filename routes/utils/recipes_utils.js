const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";

async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

async function getRecipesPreview(recipe_ids) {
    try {
        let promises = recipe_ids.map((id) => getRecipeInformation(id));
        let recipes = await Promise.all(promises);
        return recipes.map((recipe_info) => {
            let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;
            return {
                id: id,
                title: title,
                readyInMinutes: readyInMinutes,
                image: image,
                popularity: aggregateLikes,
                vegan: vegan,
                vegetarian: vegetarian,
                glutenFree: glutenFree
            };
        });
    } catch (error) {
        throw error;
    }
}


async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let {
        id,
        title,
        readyInMinutes,
        image,
        aggregateLikes,
        vegan,
        vegetarian,
        glutenFree,
        analyzedInstructions,
        extendedIngredients,
        servings
    } = recipe_info.data;

    // Flatten the instructions from analyzedInstructions if needed
    let instructions = analyzedInstructions.map((item) => {
        return item.steps.map(step => step.step).join(' ');
    }).join(' ');

    // Map extendedIngredients to a simpler format if necessary
    let ingredients = extendedIngredients.map(ingredient => {
        return {
            id: ingredient.id,
            name: ingredient.name,
            original: ingredient.original,
            amount: ingredient.amount,
            unit: ingredient.unit
        };
    });

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        analyzedInstructions: analyzedInstructions,
        instructions: instructions,
        extendedIngredients: ingredients,
        servings: servings
    };
}

async function searchRecipe(recipeName, cuisine, diet, intolerance, number) {
    const params = {
        apiKey: process.env.spooncular_apiKey,
        number: number,
        query: recipeName,
        cuisine: cuisine,
        diet: diet,
        intolerances: intolerance
    };

    try {
        const response = await axios.get(`${api_domain}/complexSearch`, { params });
        return response.data.results.map(recipe => ({
            id: recipe.id,
            title: recipe.title,
            readyInMinutes: recipe.readyInMinutes,
            image: recipe.image,
            aggregateLikes: recipe.aggregateLikes,
            vegan: recipe.vegan,
            vegetarian: recipe.vegetarian,
            glutenFree: recipe.glutenFree
        }));
    } catch (error) {
        console.error("Failed to fetch recipes:", error);
        throw error;
    }
}

async function getRandomRecipes(number) {
    const params = {
      apiKey: process.env.spooncular_apiKey,
      number: number
    };
  
    try {
      const url = `${api_domain}/random`;  
      const response = await axios.get(url, { params });  
      return response.data.recipes.map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        readyInMinutes: recipe.readyInMinutes,
        image: recipe.image,
        aggregateLikes: recipe.aggregateLikes,
        vegan: recipe.vegan,
        vegetarian: recipe.vegetarian,
        glutenFree: recipe.glutenFree
      }));
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
      throw error;
    }
  }
  



module.exports = {
    getRecipesPreview,
    getRecipeInformation,
    getRecipeDetails,
    searchRecipe,
    getRandomRecipes

};
