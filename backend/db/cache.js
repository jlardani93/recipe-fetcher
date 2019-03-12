import FoodSearch from "./schemas/FoodSearch";
import SuggestionSearch from "./schemas/SuggestionSearch";
import { getFood } from "../api";
import RecipesSearch from "./schemas/RecipesSearch";
import Recipe from "./schemas/Recipe";

export function cache(modelName, query, data) {
  const models = ['recipeSearch', 'suggestionSearch', 'foodSearch']
  console.log(`caching ${modelName}`)

  if (modelName === 'foodSearch') {
    const foodId = data.parsed[0] ? data.parsed[0].food.foodId: null
    FoodSearch.create({ label: query, foodId })
    if (foodId) Ingredient.create({ _id: foodId, label: query})
    return data
  }

  if (modelName === 'suggestionSearch') {
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

  if (modelName === 'recipeSearch') {
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
}