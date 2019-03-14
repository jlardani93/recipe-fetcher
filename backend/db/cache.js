import FoodSearch from "./schemas/FoodSearch";
import SuggestionSearch from "./schemas/SuggestionSearch";
import { getFood } from "../api";
import RecipesSearch from "./schemas/RecipesSearch";
import Recipe from "./schemas/Recipe";
import Ingredient from "./schemas/Ingredient";
import { logError } from "../utils"

export function cache(modelName, query, data) {
  console.log(`caching ${modelName}`)
  switch (modelName) {
    case 'recipeSearch': return cacheRecipeSearch(query, data)
    case 'suggestionSearch': return cacheSuggestionSearch(query, data)
    case 'foodSearch':return cacheFoodSearch(query, data)
  }
}

function cacheFoodSearch(query, data) {
  const foodId = data.parsed[0] ? data.parsed[0].food.foodId: null
  FoodSearch.create({ query, foodId }).catch(logError)
  if (foodId) Ingredient.create({ _id: foodId, label: query}).catch(logError)
  return data
}

function cacheSuggestionSearch(query, data) {
  return FoodSearch.getExistingQueries(data)
    .then( docs => {
      return Promise.all(data.map( query => {
        return Object.keys(docs).includes(query)
          ? docs[query].foodId ? query : null
          : getFood(query).then(res => res.parsed[0] ? query : null).catch(logError)
      }))
        .then(maybeIngredients => {
          const ingredients = maybeIngredients.filter(s => s !== null)
          SuggestionSearch.create({ query, suggestions: ingredients }).catch(logError)
          return ingredients
        })
        .catch(logError)
    })
    .catch(logError)
}

function cacheRecipeSearch(query, data) {
  const recipeUris = data.hits.map(({ recipe }) => recipe.uri)
  Recipe.find({ foodId: { $in: recipeUris } }).distinct('_id').exec()
    .then( cachedRecipeUris => { 
      Recipe.create((data.hits
        .filter(({ recipe }) => !cachedRecipeUris.includes(recipe.uri))
        .map(({ recipe: { uri: _id, label, image, url, ingredients: ingredientInfo } }) => (
          { _id, label, image, url, ingredientInfo }
        ))
      ))
      .catch(logError)
    })
    .catch(logError)
  RecipesSearch.create({ query, recipes: recipeUris }).catch(logError)
  return data.hits
}
