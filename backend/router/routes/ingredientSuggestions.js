import SuggestionSearch from '../../db/schemas/SuggestionSearch'
import FoodSearch from '../../db/schemas/FoodSearch'
import { getIngredientSuggestions, getFood } from '../../api';
import mongoose from 'mongoose'
import Ingredient from '../../db/schemas/Ingredient';

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
export const ingredientSuggestions = ({ query: { input } }, res) => {
  getSuggestionSearchPromise(input)
    .then( doc => {
      if (doc) {
        res.json(doc.suggestions)
      } else {
        getIngredientSuggestions(input)
          .then(getFoodSuggestionsPromise)
          .then(getRealFoodSuggestions)
          .then( suggestions => {
            SuggestionSearch.create({ label: input, suggestions })
            res.json(suggestions) 
          })
      }
    })
}

// @resolvesWith: [SuggestionSearch]
function getSuggestionSearchPromise(label) {
  return SuggestionSearch.findOne({ label: label }).exec()
}

// @resolvesWith: { suggestions: [String], docs: [FoodSearch] }
function getFoodSuggestionsPromise(suggestions) {
  return FoodSearch.find({ label: { $in: suggestions } }).exec().then( res => ({ suggestions, docs: res }))
}

function getRealFoodSuggestions({ suggestions, docs }) {
  const cachedFoodSearchInputs = docs.map(d => d.label)
  return Promise.all(suggestions.map( suggestion => {
    if (cachedFoodSearchInputs.includes(suggestion)) {
      const foodId = docs.filter(doc => doc.label === suggestion)[0].foodId
      return foodId ? suggestion : null
    } else {
      return getFood(suggestion)
        .then( res => {
          const foodId = res.parsed[0] ? res.parsed[0].food.foodId: null
          FoodSearch.create({ label: suggestion, foodId })
          if (foodId) { 
            Ingredient.create({ label: suggestion, foodId })
          }
          return suggestion
        })
    }
  })).then(filterNotNull)
}

function filterNotNull(collection) {
  return collection.filter( item => item !== null )
}

function resetDatabase(){
  SuggestionSearch.deleteMany({}, () => {console.log("deleting many")})
  FoodSearch.deleteMany({}, () => {console.log("deleting Many")})
  Ingredient.deleteMany({}, () => {console.log("deleting Many")})
}