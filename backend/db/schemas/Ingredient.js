import mongoose from 'mongoose'

const Schema = mongoose.Schema

const IngredientsSchema = new Schema({
  _id: String,
  label: String,
  recipes: [{ type: mongoose.Schema.ObjectId, ref: 'Recipe'}],
}, { timestamps: true });

export default mongoose.model('Ingredient', IngredientsSchema);