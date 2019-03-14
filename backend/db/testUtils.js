import SuggestionSearch from "./schemas/SuggestionSearch";
import FoodSearch from "./schemas/FoodSearch";
import Ingredient from "./schemas/Ingredient";
import Recipe from "./schemas/Recipe";
import RecipesSearch from "./schemas/RecipesSearch";

export function populateDatabase(){
  return SuggestionSearch.create({})
    .then(doc => console.log("It's working!", doc))
    .catch( error => { console.log('Error message:', error) })
}

export async function resetDatabase(){
  const log = (modelName) => () => { console.log('Deleting many:', modelName) }
  return Promise.all([
    SuggestionSearch.deleteMany({}, () => log('SuggestionSearch')),
    FoodSearch.deleteMany({}, log('FoodSearch')),
    Ingredient.deleteMany({}, log('Ingredient')),
    Recipe.deleteMany({}, log('Recipe')),
    RecipesSearch.deleteMany({}, log('RecipesSearch'))
  ])
  .catch( error => { console.log('Error message:', error) })
}