import mongoose from 'mongoose'
const Schema = mongoose.Schema

const IngredientsSchema = new Schema({
  id: String,
  label: String,
  foodId: String,
  Recipes: [String],
}, { timestamps: true });

export default mongoose.model('Ingredient', IngredientsSchema);