import FoodSearch from "./schemas/FoodSearch";
import SuggestionSearch from "./schemas/SuggestionSearch";
import { getFood } from "../api";
import RecipesSearch from "./schemas/RecipesSearch";
import Recipe from "./schemas/Recipe";

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
  FoodSearch.create({ label: query, foodId })
  if (foodId) Ingredient.create({ _id: foodId, label: query})
  return data
}

function cacheSuggestionSearch(query, data) {
  return FoodSearch.getExistingQueries(data)
    .then( docs => {
      return Promise.all(data.map( query => {
        Object.keys(docs).includes(query)
          ? docs[query].foodId ? query : null
          : getFood(query).then(res => res.parsed[0] ? query : null)
      }))
        .then(ingredients => {
          SuggestionSearch.create({ query, suggestions: ingredients })
          return suggestions.filter(s => s !== null)
        })
    })
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
    })
  RecipesSearch.create({ query, recipes: recipeUris })
  return data.hits
}
