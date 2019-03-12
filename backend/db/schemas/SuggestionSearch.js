import mongoose from 'mongoose'
import FoodSearch from './FoodSearch';
const Schema = mongoose.Schema

const SuggestionSearchSchema = new Schema({
  id: String,
  query: String,
  suggestions: [String],
}, { timestamps: true });


export default mongoose.model('SuggestionSearch', SuggestionSearchSchema);