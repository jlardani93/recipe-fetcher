import mongoose from 'mongoose'
import Ingredient from './Ingredient';
const Schema = mongoose.Schema

const FoodSearchSchema = new Schema({
  id: String,
  query: String, //search input
  foodId: String, //real food Id
}, { timestamps: true });

FoodSearchSchema.pre("save", () => {
  if (this.foodId) {
    Ingredient.create({ _id: foodId, query: suggestion })
  }
})

/**
 * @param {*} queries
 * @returns Promise<{ queries: [String], docs: { [query]: FoodSearch } }>
 */
FoodSearchSchema.statics.getExistingQueries = (queries) => {
  return FoodSearchSchema.find({ query: { $in: queries } }).exec()
    .then( docs => ({ 
      queries,
      docs: docs.reduce((acc, d) => ({...acc, [d.query]: d }), {})
    }))
}

export default mongoose.model('FoodSearch', FoodSearchSchema);