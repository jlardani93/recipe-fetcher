export const recipes = (req, res) => {
  getRecipes(req.query.ingredient)
    .then( recipes => {
      console.log('recipes:', recipes)
      console.log(recipes.hits[0].recipe)
      const recipe = new Recipe()
      const { foodId, label } = recipes.hits[0].recipe.ingredients[0].food
      recipe.id = foodId
      recipe.label = label
      recipe.save()
      console.log(recipes)
      res.json(recipes)
    })
}
