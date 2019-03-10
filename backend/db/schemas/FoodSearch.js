import mongoose from 'mongoose'
const Schema = mongoose.Schema

const FoodSearchSchema = new Schema({
  id: String,
  label: String, //search input
  foodId: String, //real food Id
}, { timestamps: true });

export default mongoose.model('FoodSearch', FoodSearchSchema);