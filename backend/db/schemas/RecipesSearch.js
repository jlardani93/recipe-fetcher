import mongoose from 'mongoose'
const Schema = mongoose.Schema

const RecipesSearchSchema = new Schema({
  id: String,
  query: String, //search input
  recipes: [{ type: String, ref: 'Recipe' }], 
}, { timestamps: true });

export default mongoose.model('RecipesSearch', RecipesSearchSchema);