import mongoose from 'mongoose'

const Schema = mongoose.Schema

const IngredientsSchema = new Schema({
  id: String,
  label: String,
  foodId: String,
  recipes: [{ type: mongoose.Schema.ObjectId, ref: 'Recipe'}],
}, { timestamps: true });

export default mongoose.model('Ingredient', IngredientsSchema);