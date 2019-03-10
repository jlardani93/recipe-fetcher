import mongoose from 'mongoose'
const Schema = mongoose.Schema

const RecipesSchema = new Schema({
  id: String,
  recipeId: String,
  label: String,
  image: String,
  url: String,
  ingredientInfo: [{ text: String, weight: String }],
  ingredients: [{type: mongoose.Schema.ObjectId, ref: 'Ingredient'}]
}, { timestamps: true })

export default mongoose.model('Recipe', RecipesSchema);