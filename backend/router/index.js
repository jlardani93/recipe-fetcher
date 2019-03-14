import express from 'express'
import SuggestionSearch from '../db/schemas/SuggestionSearch';
import { getIngredientSuggestions, getRecipes } from '../api';
import RecipesSearch from '../db/schemas/RecipesSearch';
import { resetDatabase } from '../db/testUtils'
import { logError } from '../utils'

export const router = express.Router()

router.get('/ingredientSuggestions', ingredientSuggestions)
router.get('/recipes', recipes)
router.get('/resetDB', resetDB)

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
function ingredientSuggestions({ query: { input: query } }, res) {
  SuggestionSearch.findOne({ query }).exec()
    .then(doc => {
      return doc
        ? res.json(doc.suggestions)
        : getIngredientSuggestions(query).then(ingredients => { res.json(ingredients) })
    })
    .catch(logError)
}

/**
 * Searches for recipes for provided ingredient string. If that request has already been cached,
 * it will return recipes from that cached query. If it has not been made, a new query will be
 * made to the edamam API, and then those recipes and that query will both be cached. 
 * @param {*} req 
 * @param {*} res 
 */
function recipes({ query: { ingredient: query } }, res) {
  RecipesSearch.findOne({ query }).populate('recipes').exec()
  .then(doc => {
    return doc
    ? res.json(doc.recipes)
    : getRecipes(query).then(recipes => { res.json(recipes) })  
  })
  .catch(logError)
}

function resetDB(_, res) {
  resetDatabase()
    .then(() => { res.json({ message: 'DB Reset' }) })
    .catch(logError)
}
