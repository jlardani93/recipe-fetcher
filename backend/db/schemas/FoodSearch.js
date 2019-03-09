import mongoose from 'mongoose'
const Schema = mongoose.Schema

const FoodSearchSchema = new Schema({
  id: String,
  label: String,
  foodId: String,
}, { timestamps: true });

export default mongoose.model('FoodSearch', FoodSearchSchema);