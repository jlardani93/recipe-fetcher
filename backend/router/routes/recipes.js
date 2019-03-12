import RecipesSearch from "../../db/schemas/RecipesSearch";
import { getRecipes } from "../../api";

/**
 * Searches for recipes for provided ingredient string. If that request has already been cached,
 * it will return recipes from that cached query. If it has not been made, a new query will be
 * made to the edamam API, and then those recipes and that query will both be cached. 
 * @param {*} req 
 * @param {*} res 
 */
export const recipes = ({ query: { ingredient: query } }, res) => {
  RecipesSearch.findOne({ query }).populate('recipes').exec()
  .then( doc => {
    doc
    ? res.json(doc.recipes)
    : getRecipes(query).then(res.json)
  })
}
