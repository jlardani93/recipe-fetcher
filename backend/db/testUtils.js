import SuggestionSearch from "./schemas/SuggestionSearch";
import FoodSearch from "./schemas/FoodSearch";
import Ingredient from "./schemas/Ingredient";
import Recipe from "./schemas/Recipe";
import RecipesSearch from "./schemas/RecipesSearch";

export function populateDatabase(){
  return SuggestionSearch.create({}).then(doc => console.log("It's working!", doc))
}

export async function resetDatabase(){
  const log = (modelName) => () => { console.log('Deleting many:', modelName) }
  await SuggestionSearch.deleteMany({}, () => log('SuggestionSearch'))
  await FoodSearch.deleteMany({}, log('FoodSearch'))
  await Ingredient.deleteMany({}, log('Ingredient'))
  await Recipe.deleteMany({}, log('Recipe'))
  await RecipesSearch.deleteMany({}, log('RecipesSearch'))
}