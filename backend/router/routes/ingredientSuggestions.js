import SuggestionSearch from '../../db/schemas/SuggestionSearch'
import FoodSearch from '../../db/schemas/FoodSearch'
import { getIngredientSuggestions, getFood } from '../../api';
import mongoose from 'mongoose'
import Ingredient from '../../db/schemas/Ingredient';
import Recipe from '../../db/schemas/Recipe';
import RecipesSearch from '../../db/schemas/RecipesSearch';

//TODO Ensure that before database save, the database checks to see if ingredient, recipes, or foods already exist

/**
 * Returns a list of suggested ingredient names beginning with the inputted string. If a query has already been made
 * with this same string, it will return a cached list of suggestions. If this is a query that has not been made before
 * it will receive suggestions from the Edemam auto-complete end-point and then filter through these suggestions for those that
 * are actual food items. In doing so, it will cache the resulting suggestions to be returned again later. It will also cache each 
 * individual Edemam suggestion as a new FoodSearch. Those suggestions that are actual food items will receive a food ID and also be 
 * used to create a new Ingredient
 * @param {*} req 
 * @param {*} res 
 */
export const ingredientSuggestions = ({ query: { input: query } }, res) => {
  SuggestionSearch.findOne({ query }).exec()
    .then( doc => {
      doc
        ? res.json(doc.suggestions)
        : getIngredientSuggestions(query).then(res.json)
    })
}
