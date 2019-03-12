import RecipesSearch from "../../db/schemas/RecipesSearch";
import { getRecipes } from "../../api";
import Recipe from "../../db/schemas/Recipe";

/**
 * Searches for recipes for provided ingredient string. If that request has already been cached,
 * it will return recipes from that cached query. If it has not been made, a new query will be
 * made to the edamam API, and then those recipes and that query will both be cached. 
 * @param {*} req 
 * @param {*} res 
 */
export const recipes = ({ query: { ingredient: query } }, res) => {
  RecipesSearch.findOne({ query }).populate('recipes').exec()
  .then( doc => {
    doc
    ? res.json(doc.recipes)
    : newRecipesSearch(query).then( recipes => res.json(recipes))
  })
}

function newRecipesSearch(query) {
  //todo, update the index of the starting recipe to be asked for. This way we can cache more recipes
  //per ingredient
  return getRecipes(query)
    .then(({ hits: maybeNewRecipes }) => {
      const recipeUris = maybeNewRecipes.map(({ recipe }) => recipe.uri)
      return Recipe.find({ foodId: { $in: recipeUris } }).exec()
        .then(getRecipeIdsForNewRecipeSearch(maybeNewRecipes))
        .then( recipeIds => { 
          RecipesSearch.create({ query, recipes: recipeIds })
          return maybeNewRecipes
        }) 
    })
}

function getRecipeIdsForNewRecipeSearch(maybeNewRecipes) {
  return function(cachedRecipes) {
    const cachedRecipeUris = cachedRecipes.map(r => r.foodId)
    return Promise.all(
      maybeNewRecipes.map(({ recipe: { uri, label, image, url, ingredients: ingredientInfo } }) => {
        if (!cachedRecipeUris.includes(uri)) {
          return Recipe.create({ foodId: uri, label, image, url, ingredientInfo })
            .then(recipe => recipe._id)
          //parse ingredients from ingredient strings 
        } else {
          return Recipe.find({recipeId: uri}).exec()
            .then(recipe => recipe._id)
        }
      })
    )
  }
}
