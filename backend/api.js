import axios from 'axios'
import { cache } from './db/cache'
require('dotenv').config({ path: '../.env' })

const { 
    RECIPE_SEARCH_APP_ID: recipeSearchId,
    RECIPE_SEARCH_API_KEY: recipeSearchKey,
    FOOD_DATABASE_APP_ID: foodSearchId,
    FOOD_DATABASE_API_KEY: foodSearchKey,
} = process.env 

const buildRecipesUrl = ingredient => (
    `https://api.edamam.com/search?app_id=${recipeSearchId}&app_key=${recipeSearchKey}&q=${ingredient}&to=100`
)

const buildIngredientSuggestionsUrl = input => (
    `http://api.edamam.com/auto-complete?q=${input}&limit=100&app_id=${foodSearchId}&app_key=${foodSearchKey}`
)

const buildFoodUrl = food => (
    `https://api.edamam.com/api/food-database/parser?ingr=${encode(food)}&app_id=${foodSearchId}&app_key=${foodSearchKey}`
)

export const getRecipes = ingredient => getData('recipeSearch', buildRecipesUrl(ingredient), ingredient)

export const getIngredientSuggestions = input => getData('suggestionSearch', buildIngredientSuggestionsUrl(input), input)

export const getFood = food => getData(buildFoodUrl('foodSearch', food), food)

function encode(string) {
    return string.replace(' ', '%20')
}

function getData(cacheModel, url, query) {
    console.log('RECIPE API URL:', url)
    return axios.get(url)
        .then(res => cache(cacheModel, query, res.data))
        .then( res => res) 
        .catch( error => { console.log('Error message:', error.response.data) })
}