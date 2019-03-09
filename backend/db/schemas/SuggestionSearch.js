import mongoose from 'mongoose'
const Schema = mongoose.Schema

const SuggestionSearchSchema = new Schema({
  id: String,
  label: String,
  suggestions: [String],
}, { timestamps: true });

export default mongoose.model('SuggestionSearch', SuggestionSearchSchema);