import axios from 'axios'
import { cache } from './db/cache'
import { logError } from './utils'
require('dotenv').config({ path: '../.env' })

const { 
    RECIPE_SEARCH_APP_ID: recipeSearchId,
    RECIPE_SEARCH_API_KEY: recipeSearchKey,
    FOOD_DATABASE_APP_ID: foodSearchId,
    FOOD_DATABASE_API_KEY: foodSearchKey,
} = process.env 

const QUERY_TYPES = ['recipeSearch', 'suggestionSearch', 'foodSearch']

const SEARCH_LIMITS = {
    suggestionSearch: 25,
    recipeSearch: 5,
    foodSearch: 25,
}

const hits = QUERY_TYPES.reduce((acc, type) => ({ ...acc, [type]: 0 }), {})
const totalHits = QUERY_TYPES.reduce((acc, type) => ({ ...acc, [type]: 0 }), {})
const timers = QUERY_TYPES.reduce((acc, type) => ({ ...acc, [type]: null }), {})

const buildRecipesUrl = ingredient => (
    `https://api.edamam.com/search?app_id=${recipeSearchId}&app_key=${recipeSearchKey}&q=${ingredient}&to=100`
)

const buildIngredientSuggestionsUrl = input => (
    `http://api.edamam.com/auto-complete?q=${input}&limit=100&app_id=${foodSearchId}&app_key=${foodSearchKey}`
)

const buildFoodUrl = food => (
    `https://api.edamam.com/api/food-database/parser?ingr=${encode(food)}&app_id=${foodSearchId}&app_key=${foodSearchKey}`
)

export const getRecipes = ingredient => {
    if (checkLimit('recipeSearch')) {
        return getData('recipeSearch', buildRecipesUrl(ingredient), ingredient)
    } else {
        throw Error("you've hit your query limit for recipe searches ")
    }
}

export const getIngredientSuggestions = input => {
    if (checkLimit('suggestionSearch')) {
        return getData('suggestionSearch', buildIngredientSuggestionsUrl(input), input)
    } else {
        throw Error("You've hit your query limit for ingredient suggestions")
    }
}

export const getFood = food => {
    if (checkLimit('foodSearch')) {
        return getData('foodSearch', buildFoodUrl(food), food)
    } else {
        throw Error("You've hit your query limit for food searches")
    }
}

export const getHits = () => ({ hits, totalHits })

function encode(string) {
    return string.replace(' ', '%20')
}

function getData(cacheModel, url, query) {
    console.log('RECIPE API URL:', url)
    return axios.get(url)
        /**
         * In order to avoid having to wait until data is cached to send http response, maybe do this:
         * .then(modify)
         * .then( res => {
         *   cache(cacheModel, query, res.data)
         *   return res
         * })
         */
        .then(res => cache(cacheModel, query, res.data))
        .then( res => res) 
        .catch(logError)
}

function checkLimit(queryType) {
    if (timers[queryType]) {
        if (hits[queryType] < SEARCH_LIMITS[queryType]) {
            hits[queryType] += 1
            totalHits[queryType] += 1
            return true
        } else {
            return false
        }
    } else {
        timers[queryType] = setTimeout(() => { 
            timers[queryType] = null
            hits[queryType] = 0
        }, 60*1000)
        return true
    }  
}

