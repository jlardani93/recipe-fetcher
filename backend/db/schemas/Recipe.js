import mongoose from 'mongoose'
const Schema = mongoose.Schema

const RecipesSchema = new Schema({
  id: String,
  label: String,
  image: String,
  url: String,
  ingredients: [String],
}, { timestamps: true })

export default mongoose.model('Recipe', RecipesSchema);