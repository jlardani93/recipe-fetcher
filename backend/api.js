import axios from 'axios'
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

export const getRecipes = ingredient => getData(buildRecipesUrl(ingredient))

export const getIngredientSuggestions = input => getData(buildIngredientSuggestionsUrl(input))

export const getFood = food => getData(buildFoodUrl(food))

function encode(string) {
    return string.replace(' ', '%20')
}

function getData(url) {
    console.log('RECIPE API URL:', url)
    return axios.get(url)
        .then(res => res.data)
        .catch( error => { console.log('Error message:', error.response.data) })
}