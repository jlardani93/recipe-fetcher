import FoodSearch from "./schemas/FoodSearch";

export function cache(modelName, query, data) {
  const models = ['recipeSearch', 'suggestionSearch', 'foodSearch']
  console.log(`caching ${modelName}`)

  if (modelName === 'foodSearch') {
    FoodSearch.create({ 
      label: suggestion,
      foodId: data.parsed[0] ? data.parsed[0].food.foodId: null
    })
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
            suggestionSearch.create({ query, suggestions: ingredients })
            return suggestions.filter(s => s !== null)
          })
      })
  }
}